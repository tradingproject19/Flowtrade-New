import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from "@angular/core";
import { ChartDataFeed } from "./datafeed/datafeed";
import { FirebaseAuthBackend } from "src/app/authUtils";
import { User } from "src/app/core/models/auth.models";
import * as uuid from "uuid";
import {
  ChartData,
  ChartMetaInfo,
  ChartTemplateContent,
  ChartingLibraryWidgetOptions,
  CustomIndicator,
  IChartingLibraryWidget,
  IPineStudyResult,
  LanguageCode,
  LibraryPineStudy,
  NewsItem,
  RawStudyMetaInfoId,
  ResolutionString,
  StudyLinePlotPreferences,
  StudyPlotType,
  StudyTemplateData,
  StudyTemplateMetaInfo,
  TradingTerminalWidgetOptions,
  widget,
} from "../../../../assets/charting_library";
import { ChartsDataService } from "src/app/core/services/charts-data.service";
import * as moment from "moment";
import { SaveLoadAdapterService } from "src/app/core/services/save-load-adapter.service";
import { WatchlistService } from "src/app/core/services/watchlist.service";
import { DatabaseService } from "src/app/core/services/database.service";
@Component({
  selector: "app-chart-component",
  templateUrl: "./tv-chart.component.html",
  styleUrls: ["./tv-chart.component.scss"],
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  public _symbol: ChartingLibraryWidgetOptions["symbol"] = "AAPL";
  public _interval: ChartingLibraryWidgetOptions["interval"] =
    "1" as ResolutionString;
  public _libraryPath: ChartingLibraryWidgetOptions["library_path"] =
    "assets/charting_library/";
  public _chartsStorageUrl: ChartingLibraryWidgetOptions["charts_storage_url"] =
    "https://api.flowtrade.com";
  public _chartsStorageApiVersion: ChartingLibraryWidgetOptions["charts_storage_api_version"] =
    "1.1";
  public _clientId: ChartingLibraryWidgetOptions["client_id"] = "flowtrade.com";
  public _userId: ChartingLibraryWidgetOptions["user_id"] = "public_user_id";
  public _fullscreen: ChartingLibraryWidgetOptions["fullscreen"] = false;
  public _autosize: ChartingLibraryWidgetOptions["autosize"] = true;
  public _containerId: ChartingLibraryWidgetOptions["container"] =
    "tv_chart_container";
  public _tvWidget: IChartingLibraryWidget | null = null;
  public _chartId = uuid.v4();
  public _inputSymbol: Symbol | undefined;

  private user: User;
  @Input()
  set inputSymbol(symbol: Symbol) {
    this._inputSymbol = symbol || this._inputSymbol;
  }

  @Input()
  set chartId(chartId: string) {
    this._chartId = chartId || this._chartId;
  }

  @Input()
  set symbol(symbol: ChartingLibraryWidgetOptions["symbol"]) {
    this._symbol = symbol || this._symbol;
  }

  @Input()
  set interval(interval: ChartingLibraryWidgetOptions["interval"]) {
    this._interval = interval || this._interval;
  }

  @Input()
  set libraryPath(libraryPath: ChartingLibraryWidgetOptions["library_path"]) {
    this._libraryPath = libraryPath || this._libraryPath;
  }

  @Input()
  set chartsStorageUrl(
    chartsStorageUrl: ChartingLibraryWidgetOptions["charts_storage_url"]
  ) {
    this._chartsStorageUrl = chartsStorageUrl || this._chartsStorageUrl;
  }

  @Input()
  set chartsStorageApiVersion(
    chartsStorageApiVersion: ChartingLibraryWidgetOptions["charts_storage_api_version"]
  ) {
    this._chartsStorageApiVersion =
      chartsStorageApiVersion || this._chartsStorageApiVersion;
  }

  @Input()
  set clientId(clientId: ChartingLibraryWidgetOptions["client_id"]) {
    this._clientId = clientId || this._clientId;
  }

  @Input()
  set userId(userId: ChartingLibraryWidgetOptions["user_id"]) {
    this._userId = userId || this._userId;
  }

  @Input()
  set fullscreen(fullscreen: ChartingLibraryWidgetOptions["fullscreen"]) {
    this._fullscreen = fullscreen || this._fullscreen;
  }

  @Input()
  set autosize(autosize: ChartingLibraryWidgetOptions["autosize"]) {
    this._autosize = autosize || this._autosize;
  }

  @Input()
  set containerId(containerId: ChartingLibraryWidgetOptions["container"]) {
    this._containerId = containerId || this._containerId;
  }
  constructor(
    private datafeed: ChartDataFeed,
    private firebaseBackend: FirebaseAuthBackend,
    private dataService: ChartsDataService,
    private httpService: DatabaseService,
    private watchListService: WatchlistService
  ) {
    this.user = this.firebaseBackend.getAuthenticatedUser();
    this.userId = this.user.uid;
  } // Inside a method or lifecycle hook where you want to trigger the refresh

  async ngAfterViewInit() {
    function getLanguageFromURL(): LanguageCode | null {
      const regex = new RegExp("[\\?&]lang=([^&#]*)");
      const results = regex.exec(location.search);

      return results === null
        ? null
        : (decodeURIComponent(results[1].replace(/\+/g, " ")) as LanguageCode);
    }

    const widgetOptions: TradingTerminalWidgetOptions = {
      symbol: this._symbol,
      datafeed: this.datafeed,
      interval: this._interval,
      container: this._chartId,
      library_path: "assets/charting_library/",
      locale: getLanguageFromURL() || "en",
      disabled_features: [
        "open_account_manager",
        "trading_account_manager",
        "save_chart_properties_to_local_storage",
      ],
      enabled_features: [
        "study_templates",
        "add_to_watchlist",
        "chart_crosshair_menu",
        "tick_resolution",
        "use_localstorage_for_settings",
        "pre_post_market_sessions",
        "show_symbol_logos",
        "watchlist_sections",
      ],
      charts_storage_url: this._chartsStorageUrl,
      charts_storage_api_version: this._chartsStorageApiVersion,
      client_id: this._clientId,
      user_id: this.user.uid,
      fullscreen: this._fullscreen,
      autosize: this._autosize,
      theme: "dark",
      overrides: {
        "paneProperties.background": "#222736",
        "scalesProperties.textColor": "#a6b0cf",
      },
      //debug: true,
      news_provider: async (symbol, callback) => {
        let newItem = await this.dataService.getTickerNews(symbol);
        let result: NewsItem[] = [];
        newItem.results.forEach((item) => {
          let newsItem: NewsItem = {
            published: moment(item.published_utc).valueOf(),
            source: item.publisher.name,
            title: item.title,
            fullDescription: item.description,
            shortDescription: item.description ?? "",
            link: item.amp_url,
          };
          result.push(newsItem);
        });
        console.log(result, "news");
        callback({
          title: `Top Stories`,
          newsItems: result,
        });
      },
      symbol_search_request_delay: 1000,
      custom_css_url: "../../../assets/scss/custom/components/_tvcharts.css",
      widgetbar: {
        news: true,
        details: true,
        watchlist: true,
        datawindow: true,
      },
      load_last_chart: true,
      save_load_adapter: {
        getAllCharts: async () => {
          let charts = await this.httpService.getAllCharts(this.user.uid);
          return charts;
        },
        removeChart: async <T extends string | number>(id: T) => {
          await this.httpService.removeChart(id, this.userId);
        },
        saveChart: async (chartData: ChartData) => {
          let result = await this.httpService.saveChart(
            chartData,
            this.user.uid
          );
          return result?.data;
        },
        getChartContent: async (chartId: number) => {
          let chartContent = await this.httpService.getChartContent(
            chartId,
            this.user.uid
          );
          return chartContent;
        },

        getAllStudyTemplates: async () => {
          return await this.httpService.getAllStudyTemplates(this.user.uid);
        },

        removeStudyTemplate: async (
          studyTemplateInfo: StudyTemplateMetaInfo
        ) => {
          await this.httpService.removeStudyTemplate(
            studyTemplateInfo,
            this.user.uid
          );
        },

        saveStudyTemplate: async (studyTemplateData: StudyTemplateData) => {
          await this.httpService.saveStudyTemplate(
            studyTemplateData,
            this.user.uid
          );
        },
        getStudyTemplateContent: async (
          studyTemplateInfo: StudyTemplateMetaInfo
        ) => {
          return this.httpService.getStudyTemplateContent(
            studyTemplateInfo,
            this.user.uid
          );
        },

        getDrawingTemplates: async (toolName: string) => {
          return await this.httpService.getDrawingTemplates(
            toolName,
            this.user.uid
          );
        },
        loadDrawingTemplate: async (toolName: string, templateName: string) => {
          return await this.httpService.loadDrawingTemplate(
            toolName,
            templateName,
            this.user.uid
          );
        },
        removeDrawingTemplate: async (
          toolName: string,
          templateName: string
        ) => {
          await this.httpService.removeDrawingTemplate(
            toolName,
            templateName,
            this.user.uid
          );
        },
        saveDrawingTemplate: async (
          toolName: string,
          templateName: string,
          content: string
        ) => {
          await this.httpService.saveDrawingTemplate(
            toolName,
            templateName,
            content,
            this.user.uid
          );
        },

        getChartTemplateContent: async (templateName: string) => {
          return new Promise<any>((data: any) => {});
        },
        getAllChartTemplates(): Promise<string[]> {
          return new Promise<any>((data: any) => {});
        },
        saveChartTemplate(
          newName: string,
          theme: ChartTemplateContent
        ): Promise<void> {
          return new Promise<any>((data: any) => {});
        },
        removeChartTemplate(templateName: string): Promise<void> {
          return new Promise<any>((data: any) => {});
        },
      },
      //debug: true,
      custom_indicators_getter: (PineJS) => {
        return Promise.resolve<CustomIndicator[]>([
          /* Requesting data for another ticker */
          {
            name: "Equity Flowtrade",
            metainfo: {
              _metainfoVersion: 51,
              id: "EquityFT@tv-basicstudies-1" as RawStudyMetaInfoId,
              description: "Equity Flowtrade",
              shortDescription: "Equity Flowtrade",
              is_price_study: true,
              isCustomIndicator: true,
              format: {
                type: "price",
                // Precision is set to one digit, e.g. 777.7
                precision: 1,
              },

              plots: [{ id: "plot_0", type: StudyPlotType.Line }],
              defaults: {
                styles: {
                  plot_0: {
                    linestyle: 0,
                    visible: true,

                    // Make the line thinner
                    linewidth: 1,

                    // Plot type is Line
                    plottype: 2 as StudyLinePlotPreferences["plottype"],

                    // Show price line
                    trackPrice: true,

                    // Set the plotted line color to dark red
                    color: "#880000",
                  },
                },

                inputs: {},
              },
              styles: {
                plot_0: {
                  // Output name will be displayed in the Style window
                  title: "Equity value",
                  histogramBase: 0,
                },
              },
              inputs: [],
            },

            constructor: function (this: LibraryPineStudy<IPineStudyResult>) {
              this.init = function (context, inputCallback) {
                console.log(context);
                this._context = context;
                this._input = inputCallback;

                const symbol = context.symbol.ticker; // #EQUITY should be replaced with the symbol you want to resolve
                this._context.new_sym(symbol, PineJS.Std.period(this._context));
              };

              this.main = function (context, inputCallback) {
                this._context = context;
                this._input = inputCallback;
                // Select the main symbol
                this._context.select_sym(0);
                const mainSymbolTime = this._context.new_var(
                  this._context.symbol.time
                );

                // Select the secondary symbol ("#EQUITY")
                this._context.select_sym(1);
                const secondarySymbolTime = this._context.new_var(
                  this._context.symbol.time
                );

                // Align the times of the secondary symbol to the main symbol
                const secondarySymbolClose = this._context.new_var(
                  PineJS.Std.close(this._context)
                );
                const alignedClose = secondarySymbolClose.adopt(
                  secondarySymbolTime,
                  mainSymbolTime,
                  1
                );

                // Select the main symbol again
                this._context.select_sym(0);

                return [alignedClose];
              };
            },
          },
        ]);
      },
    };

    const tvWidget = new widget(widgetOptions);
    this._tvWidget = tvWidget;
    tvWidget.onChartReady(async () => {
      let watchlist = await this._tvWidget.watchList();
      await this.watchListService.subscribeToWatchlistEvents(watchlist);
    });
    tvWidget.subscribe("onAutoSaveNeeded", () => {
      tvWidget.saveChartToServer(
        () => {
          console.log("data saved");
        },
        () => {
          console.log("data save error");
        }
      );
    });

    tvWidget.subscribe("drawing", (data) => {
      tvWidget.save((data) => {
        console.log(data, "drawing");
      });
    });
    tvWidget.headerReady().then(() => {
      tvWidget
        .createDropdown({
          title: "",
          tooltip: "Open Main Menu",
          items: [
            {
              title: "item#1",
              onSelect: () => {
                console.log("1");
              },
            },
            {
              title: "item#2",
              onSelect: () => {
                //tvWidget.setSymbol("IBM", "1D");
              },
            },
            {
              title: "item#3",
              onSelect: () => {
                tvWidget.activeChart().createStudy("MACD", false, false, {
                  in_0: 14,
                  in_1: 30,
                  in_3: "close",
                  in_2: 9,
                });
              },
            },
          ],
          icon: `<img src="../../../assets/images/logo.png" />`,
        })
        .then((myDropdownApi) => {
          // Use myDropdownApi if you need to update the dropdown:
          // myDropdownApi.applyOptions({
          //     title: 'a new title!'
          // });
          // Or remove the dropdown:
          // myDropdownApi.remove();
        });
    });
  }

  ngOnDestroy() {
    if (this._tvWidget !== null) {
      this._tvWidget.remove();
      this._tvWidget = null;
    }
  }

  onIndicatorChange(newSetting: any) {
    console.log(newSetting);
  }
}
