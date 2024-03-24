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
  FilledAreaType,
  IChartingLibraryWidget,
  IPineStudyResult,
  LanguageCode,
  LibraryPineStudy,
  NewsItem,
  RawStudyMetaInfoId,
  ResolutionString,
  StudyInputType,
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
        // "open_account_manager",
        // "trading_account_manager",
        // "save_chart_properties_to_local_storage",
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
        "studies_extend_time_scale",
        "save_chart_properties_to_local_storage",
        "trading_account_manager",
        "open_account_manager"

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

          //Insert additional indicators Below Here at this level
          {
            name: 'FlowTrade MTF Keltner Channels',
            metainfo: {
                _metainfoVersion: 53,
                id: 'FTMTFKelts@tv-basicstudies-1' as RawStudyMetaInfoId,
                description: 'FlowTrade MTF keltner Channels',
                shortDescription: 'FT MTF Kelts',
                is_price_study: true,
                isCustomIndicator: true,
                plots: [
                    {
                        id: 'plot_0',
                        type: StudyPlotType.Line,
                    },
                    {
                        id: 'plot_1',
                        type: StudyPlotType.Line,
                    },
                    {
                        id: 'plot_2',
                        type: StudyPlotType.Line,
                    },
                    {
                        id: 'plot_3',
                        type: StudyPlotType.Line,
                    },
                    {
                        id: 'plot_4',
                        type: StudyPlotType.Line,
                    },
                    {
                        id: 'plot_5',
                        type: StudyPlotType.Line,
                    },
                    {
                        id: 'plot_6',
                        type: StudyPlotType.Line,
                    },
                    {
                        id: 'plot_7',
                        type: StudyPlotType.Colorer,
                        target: 'plot_0',
                        palette: 'paletteId1',
                    },
                ],

                filledAreas: [
                  {
                      id: 'upperZone',
                      objAId: 'plot_0',
                      objBId: 'plot_1',
                      title: 'Upper Zone',
                      type: FilledAreaType.TypePlots,
                  },
                  {
                      id: 'lowerZone',
                      objAId: 'plot_3',
                      objBId: 'plot_4',
                      title: 'Lower Zone',
                      type: FilledAreaType.TypePlots,
                },
              ],

                defaults: {
                  filledAreasStyle: {
                      upperZone: {
                          color: 'blue',
                          visible: true,
                          transparency: 50,
                      },
                      lowerZone: {
                          color: 'blue',
                          visible: true,
                          transparency: 50,
                      },
                  },

                  styles: {},
                  precision: 4,
                  inputs: {
                    len: 20,
                    mult1: 1.5,
                    mult2: 2.0,
                    mult3: 3.5,
                    res: "15"
                  },
                },
                styles: {
                    plot_0: {
                        title: 'Outside Upper',
                        histogramBase: 0,
                    },
                    plot_1: {
                        title: 'Inside Upper',
                        histogramBase: 0,
                    },
                    plot_2: {
                        title: 'Middle',
                        histogramBase: 0,
                    },
                    plot_3: {
                        title: 'Inside Lower',
                        histogramBase: 0,
                    },
                    plot_4: {
                        title: 'Outside Lower',
                        histogramBase: 0,
                    },
                    plot_5: {
                        title: '3rd Upper',
                        histogramBase: 0,
                    },
                    plot_6: {
                        title: '3rd Lower',
                        histogramBase: 0,
                    },
                },
                inputs: [
                  {
                    id: "len",
                    name: "Length",
                    defval: 20,
                    type: StudyInputType.Integer,
                  },
                  {
                    id: "mult1",
                    name: "1st Multiplier",
                    defval: 1.5,
                    type: StudyInputType.Integer,
                  },
                  {
                    id: "mult2",
                    name: "2nd Multiplier",
                    defval: 2.0,
                    type: StudyInputType.Integer,
                  },
                  {
                    id: "mult3",
                    name: "3rd Multiplier",
                    defval: 3.5,
                    type: StudyInputType.Integer,
                  },
                  {
                    id: "res",
                    name: "Timeframe",
                    defval: '15' as ResolutionString,
                    type: StudyInputType.Resolution,
                  }
                ],
                format: {
                    type: 'price',
                    precision: 2,
                },
            },
            constructor: function (
                this: LibraryPineStudy<IPineStudyResult>
            ) {
                  this.init = function (context, inputCallback) {
                    this._context = context;
                    this._input = inputCallback;

                  var res = this._input(4)
                  this._context.new_sym(
                      PineJS.Std.ticker(this._context),
                      res
                  );
                };
                  this.main = function (context, inputCallback) {
                    this._context = context;
                    this._input = inputCallback;


                    //this._context.select_sym(0);
                    //const mainSymbolTime = this._context.new_var(this._context.symbol.time);
                    var mainSymbolTime = this._context.new_var(this._context.symbol.time)
                    this._context.select_sym(1);
                    var mtfSymbolTime = this._context.new_var(this._context.symbol.time)
                    //const secondarySymbolTime = this._context.new_var(this._context.symbol.time);

                    var len = this._input(0)
                    var mult1 = this._input(1)
                    var mult2 = this._input(2)
                    var mult3 = this._input(3)
                    var i=PineJS.Std.close(this._context)
                    var close = this._context.new_var(i)
                    var atr = PineJS.Std.atr(len, this._context)
                    var ma = PineJS.Std.sma(close, len, this._context)

                    //var up1 = this._context.new_var(ma + atr * mult2)
                    var oUp = this._context.new_var(ma + atr * mult2)
                    var iUp = this._context.new_var(ma + atr * mult1)
                    var mi = this._context.new_var(ma)
                    var iLo = this._context.new_var(ma - atr * mult1)
                    var oLo = this._context.new_var(ma - atr * mult2)
                    var Up3 = this._context.new_var(ma + atr * mult3)
                    var Lo3 = this._context.new_var(ma - atr * mult3)

                    this._context.select_sym(0)

                    var oUpper = oUp.adopt(mtfSymbolTime, mainSymbolTime, 0)
                    var iUpper = iUp.adopt(mtfSymbolTime, mainSymbolTime, 0)
                    var mid = mi.adopt(mtfSymbolTime, mainSymbolTime, 0)
                    var iLower = iLo.adopt(mtfSymbolTime, mainSymbolTime, 0)
                    var oLower =oLo.adopt(mtfSymbolTime, mainSymbolTime, 0)
                    var u3 = Up3.adopt(mtfSymbolTime, mainSymbolTime, 0)
                    var l3 = Lo3.adopt(mtfSymbolTime, mainSymbolTime, 0)

                    return [oUpper, iUpper, mid, iLower, oLower, u3, l3];
                };
            },
        },
// eND kELTS
// bEGIN CYCLE POINT
        {
          name: 'FlowTrade Cycle Point',
          metainfo: {
              _metainfoVersion: 54,
              id: 'FTCyclePoint@tv-basicstudies-1' as RawStudyMetaInfoId,
              description: 'FlowTrade Cycle Point Indicator',
              shortDescription: 'FT Cycle Point',
              is_price_study: true,
              isCustomIndicator: true,
              plots: [
                  {
                      id: 'plot_0',
                      type: StudyPlotType.Line,
                  },
                  {
                      id: 'plot_1',
                      type: StudyPlotType.Line,
                  },
                  {
                      id: 'plot_2',
                      type: StudyPlotType.Line,
                  },
                  {
                      id: 'plot_3',
                      type: StudyPlotType.Line,
                  },
                  {
                      id: 'plot_4',
                      type: StudyPlotType.Line,
                  },
                  {
                      id: 'plot_5',
                      type: StudyPlotType.Line,
                  },
              ],

              defaults: {
                styles: {},
                precision: 4,
                inputs: {
                  fast: 12,
                  slow: 26,
                  siglen: 9,
                  res1: "5",
                  res2: "15",
                  res3: "30",
                  res4: "60",
                  res5: "4H",
                  res6: "D"
                },
              },
              styles: {
                  plot_0: {
                      title: 'Resolution 1',
                      histogramBase: 0,
                  },
                  plot_1: {
                      title: 'Resolution 2',
                      histogramBase: 0,
                  },
                  plot_2: {
                      title: 'Resolution 3',
                      histogramBase: 0,
                  },
                  plot_3: {
                      title: 'Resolution 4',
                      histogramBase: 0,
                  },
                  plot_4: {
                      title: 'Resolution 5',
                      histogramBase: 0,
                  },
                  plot_5: {
                      title: 'Resolution 6',
                      histogramBase: 0,
                  },
              },
              inputs: [
                {
                  id: "fast",
                  name: "Fast MA",
                  defval: 12,
                  type: StudyInputType.Integer,
                },
                {
                  id: "slow",
                  name: "Slow MA",
                  defval: 26,
                  type: StudyInputType.Integer,
                },
                {
                  id: "siglen",
                  name: "Signal",
                  defval: 9,
                  type: StudyInputType.Integer,
                },
                {
                  id: "res1",
                  name: "Timeframe",
                  defval: '5' as ResolutionString,
                  type: StudyInputType.Resolution,
                },
                {
                  id: "res2",
                  name: "Timeframe",
                  defval: '15' as ResolutionString,
                  type: StudyInputType.Resolution,
                },
                {
                  id: "res3",
                  name: "Timeframe",
                  defval: '30' as ResolutionString,
                  type: StudyInputType.Resolution,
                },
                {
                  id: "res4",
                  name: "Timeframe",
                  defval: '60' as ResolutionString,
                  type: StudyInputType.Resolution,
                },
                {
                  id: "res5",
                  name: "Timeframe",
                  defval: '4H' as ResolutionString,
                  type: StudyInputType.Resolution,
                },
                {
                  id: "res6",
                  name: "Timeframe",
                  defval: 'D' as ResolutionString,
                  type: StudyInputType.Resolution,
                },
              ],
              format: {
                  type: 'price',
                  precision: 2,
              },
          },
          constructor: function (
              this: LibraryPineStudy<IPineStudyResult>
          ) {
                this.init = function (context, inputCallback) {
                  this._context = context;
                  this._input = inputCallback;

                var res1 = this._input(3)
                this._context.new_sym(PineJS.Std.ticker(this._context), res1);
                var res2 = this._input(4)
                this._context.new_sym(PineJS.Std.ticker(this._context), res2);
                var res3 = this._input(5)
                this._context.new_sym(PineJS.Std.ticker(this._context), res3);
                var res4 = this._input(6)
                this._context.new_sym(PineJS.Std.ticker(this._context), res4);
                var res5 = this._input(7)
                this._context.new_sym(PineJS.Std.ticker(this._context), res5);
                var res6 = this._input(8)
                this._context.new_sym(PineJS.Std.ticker(this._context), res6);
              };
                this.main = function (context, inputCallback) {
                  this._context = context;
                  this._input = inputCallback;

                  var mainSymbolTime = this._context.new_var(this._context.symbol.time)

                  const fast = this._input(0)
                  const slow = this._input(1)
                  const sigLen = this._input(2)
                  const alphaX = 2 / (1 + fast)
                  const alphaY = 2 / (1 + slow)

                  this.f_CyclePoint = function () {
                    var i=PineJS.Std.close(this._context)
                    var close = this._context.new_var(i)
                    var fEma = PineJS.Std.ema(close, fast, this._context)
                    var fastEma = this._context.new_var(fEma)
                    var sEma = PineJS.Std.ema(close, slow, this._context)
                    var slowEma = this._context.new_var(sEma)
                    var macd = this._context.new_var(fastEma - slowEma)
                    var sEma = PineJS.Std.ema(macd, sigLen, this._context)
                    var sig = this._context.new_var(sEma)
                    var rPnt = PineJS.Std.round(((macd.get(1) + ((1 - alphaY) * slowEma.get(1)) - ((1 - alphaX) * fastEma.get(1))) / (alphaX - alphaY))*100)/100
                    var rPnt2 = this._context.new_var(rPnt)
                    var cPnt = PineJS.Std.round(((sig + 0.01 + ((1 - alphaY) * slowEma.get(1)) - ((1 - alphaX) * fastEma.get(1))) / (alphaX - alphaY))*100)/100
                    var cPnt2 = this._context.new_var(cPnt)
                    return {
                      'rPoint': rPnt2,
                      'cPoint': cPnt2
                    }
                  }

                  this._context.select_sym(1);
                  var resTime1 = this._context.new_var(this._context.symbol.time)
                  var cRes1 = this.f_CyclePoint();

                  this._context.select_sym(2);
                  var resTime2 = this._context.new_var(this._context.symbol.time)
                  var cRes2 = this.f_CyclePoint();

                  this._context.select_sym(3);
                  var resTime3 = this._context.new_var(this._context.symbol.time)
                  var cRes3 = this.f_CyclePoint();

                  this._context.select_sym(4);
                  var resTime4 = this._context.new_var(this._context.symbol.time)
                  var cRes4 = this.f_CyclePoint();

                  this._context.select_sym(5);
                  var resTime5 = this._context.new_var(this._context.symbol.time)
                  var cRes5 = this.f_CyclePoint();

                  this._context.select_sym(6);
                  var resTime6 = this._context.new_var(this._context.symbol.time)
                  var cRes6 = this.f_CyclePoint();

                  this._context.select_sym(0)
                  var rPointRes1 = cRes1.rPoint.adopt(resTime1, mainSymbolTime, 0)
                  var rPointRes2 = cRes2.rPoint.adopt(resTime2, mainSymbolTime, 0)
                  var rPointRes3 = cRes3.rPoint.adopt(resTime3, mainSymbolTime, 0)
                  var rPointRes4 = cRes4.rPoint.adopt(resTime4, mainSymbolTime, 0)
                  var rPointRes5 = cRes5.rPoint.adopt(resTime5, mainSymbolTime, 0)
                  var rPointRes6 = cRes6.rPoint.adopt(resTime6, mainSymbolTime, 0)

                  return [rPointRes1,rPointRes2,rPointRes3,rPointRes4,rPointRes5,rPointRes6];
              };
            },
        },
// end CYCLE POINT
// BEGING FLOW INDEX
          {
            name: 'FlowTrade Flow Index',
            metainfo: {
                _metainfoVersion: 55,
                id: 'FTFlowIndex@tv-basicstudies-1' as RawStudyMetaInfoId,
                description: 'FlowTrade Flow Index Indicator',
                shortDescription: 'FTFI',
                is_price_study: true,
                isCustomIndicator: true,
                plots: [
                    {
                        id: 'plot_0',
                        type: StudyPlotType.Line,
                    },

                ],


                defaults: {

                  styles: {},
                  precision: 2,
                  inputs: {},
                },
                styles: {
                    plot_0: {
                        title: 'Flow Index',
                        histogramBase: 0,
                    },

                },
                inputs: [],
                format: {
                    type: 'price',
                    precision: 2,
                },
            },
            constructor: function (
                this: LibraryPineStudy<IPineStudyResult>
            ) {
                  this.init = function (context, inputCallback) {
                    this._context = context;
                    this._input = inputCallback;

                };
                  this.main = function (context, inputCallback) {
                    this._context = context;
                    this._input = inputCallback;

                    var c =PineJS.Std.close(this._context)
                    var h = PineJS.Std.high(this._context)
                    var l = PineJS.Std.low(this._context)
                    var o = PineJS.Std.open(this._context)
                    var vol = PineJS.Std.volume(this._context)

                    var tw = h - Math.max(o, c)
                    var bw = Math.min(o, c) - l
                    var body = Math.abs(c - o)

                    // this.f_rate = function () {

                    //   var v = vol > 1000000 ? vol / 50000 : vol > 10000 ? vol / 50 : vol
                    //   var ret = 0.5 * (tw + bw + 2 * body) / (tw + bw + body) * v
                    //   ret = ret == 0 ? 0.5 : ret
                    //   ret = o > c ? -ret : ret
                    //   var deltaSum = PineJS.Std.cum(ret, this._context)
                    //   console.log("deltasum is a " + deltaSum)

                    //   return {deltaSum}

                    // }

                    var v = vol > 1000000 ? vol / 50000 : vol > 10000 ? vol / 50 : vol
                    var ret = 0.5 * (tw + bw + 2 * body) / (tw + bw + body) * v
                    ret = ret == 0 ? 0.5 : ret
                    ret = o > c ? -ret : ret
                    var flowIndex = PineJS.Std.cum(ret, this._context)
                    console.log("flowindex is a " + flowIndex)

                    // return {flowIndex}


                    //Now you can call the get function and set function separately
                    // var flowIndex = this.f_rate()
                    // console.log("flowindex is a " + flowIndex)
                    // console.log("f_rate is a " + this.f_rate)
                    // return [flowIndex];
                    return [flowIndex];
                };

            },
        },
// eND fLOW INDEX
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
    // tvWidget.headerReady().then(() => {
    //   tvWidget
    //     .createDropdown({
    //       title: "",
    //       tooltip: "Open Main Menu",
    //       items: [
    //         {
    //           title: "item#1",
    //           onSelect: () => {
    //             console.log("1");
    //           },
    //         },
    //         {
    //           title: "item#2",
    //           onSelect: () => {
    //             //tvWidget.setSymbol("IBM", "1D");
    //           },
    //         },
    //         {
    //           title: "item#3",
    //           onSelect: () => {
    //             tvWidget.activeChart().createStudy("MACD", false, false, {
    //               in_0: 14,
    //               in_1: 30,
    //               in_3: "close",
    //               in_2: 9,
    //             });
    //           },
    //         },
    //       ],
    //       // icon: `<img src="../../../assets/images/logo.png" />`,
    //     })
    //     .then((myDropdownApi) => {
    //       // Use myDropdownApi if you need to update the dropdown:
    //       // myDropdownApi.applyOptions({
    //       //     title: 'a new title!'
    //       // });
    //       // Or remove the dropdown:
    //       // myDropdownApi.remove();
    //     });
    // });
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
