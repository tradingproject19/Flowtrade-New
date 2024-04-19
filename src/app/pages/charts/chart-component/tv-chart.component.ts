import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from "@angular/core";
import fetch from "node-fetch";
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
  IContext,
  IPineSeries,
  IPineStudyResult,
  LanguageCode,
  LibraryPineStudy,
  LineToolsAndGroupsLoadRequestContext,
  LineToolsAndGroupsLoadRequestType,
  LineToolsAndGroupsState,
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
import { computeVisibleDayRange } from "@fullcalendar/core/internal";
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
        "seconds_resolution",
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
      debug: true,
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
        saveLineToolsAndGroups: function (
          layoutId: string,
          chartId: string | number,
          state: LineToolsAndGroupsState
        ): Promise<void> {
          throw new Error("Function not implemented.");
        },
        loadLineToolsAndGroups: function (
          layoutId: string,
          chartId: string | number,
          requestType: LineToolsAndGroupsLoadRequestType,
          requestContext: LineToolsAndGroupsLoadRequestContext
        ): Promise<Partial<LineToolsAndGroupsState>> {
          throw new Error("Function not implemented.");
        },
      },
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
          {
            name: "Flow Index Test",
            metainfo: {
              _metainfoVersion: 52,
              is_hidden_study: false,
              is_price_study: true,

              isCustomIndicator: true,
              defaults: {
                styles: {
                  plot_0: {
                    linestyle: 0,
                    linewidth: 1,
                    plottype: 0,
                    trackPrice: false,
                    transparency: 0,
                    visible: true,
                    color: "#2196F3",
                  },
                },
                inputs: {},
              },
              plots: [
                {
                  id: "plot_0",
                  type: StudyPlotType.Line,
                },
              ],
              styles: {
                plot_0: {
                  title: "Plot",
                  histogramBase: 0,
                  joinPoints: false,
                },
              },
              description: "Flow Index",
              shortDescription: "Flow Index",
              inputs: [
                // {
                //   id: "first_visible_bar_time",
                //   name: "First Visible Bar Time",
                //   defval: 0,
                //   isHidden: !0,
                //   max: 253370764800,
                //   min: -253370764800,
                //   type: "time",
                // },
                // {
                //   id: "last_visible_bar_time",
                //   name: "Last Visible Bar Time",
                //   defval: 0,
                //   isHidden: !0,
                //   max: 253370764800,
                //   min: -253370764800,
                //   type: "time",
                // },
              ],
              id: "Flow Index@tv-basicstudies-1" as RawStudyMetaInfoId,
              name: "Net Volume Test",
              format: {
                type: "price",
                // Precision is set to one digit, e.g. 777.7
                precision: 1,
              },
            },
            constructor: function (this: LibraryPineStudy<IPineStudyResult>) {
              var distanceScreenY;
              this.init = function (context, inputCallback) {
                distanceScreenY = tvWidget.chart(0).getAllPanesHeight()[0] / 2;
              };
              const upAndDownVolume = (
                close: number,
                lastClose: number,
                open: number,
                volume: number
              ): number => {
                let posVol = 0.0;
                let negVol = 0.0;
                let isBuyVolume = true;

                switch (true) {
                  case close > open:
                    isBuyVolume = true;
                    break;
                  case close < open:
                    isBuyVolume = false;
                    break;
                  case close > lastClose:
                    isBuyVolume = true;
                    break;
                  case close < lastClose:
                    isBuyVolume = false;
                    break;
                }

                if (isBuyVolume) posVol += volume;
                else negVol -= volume;

                return posVol + negVol;
              };

              const getHighLow = (
                arr: IPineSeries
              ): [number, number, number] => {
                let cumVolume = 0.0;
                let maxVolume = 0.0;
                let minVolume = 0.0;

                cumVolume += arr.get();
                maxVolume = Math.max(maxVolume, cumVolume);
                minVolume = Math.min(minVolume, cumVolume);

                return [maxVolume, minVolume, cumVolume];
              };

              var tickVol = [];

              // Function to compute delta volume, max delta volume, min delta volume, and total delta volume
              function Vol() {
                var deltaVol = 0.0;
                var totalDeltaVol = 0.0;
                var maxDeltaVol = 0.0;
                var minDeltaVol = 0.0;
                var temp = close.length;
                for (var i = 0; i < temp; i++) {
                  deltaVol += tickVol[i] || 0;
                  totalDeltaVol += Math.abs(tickVol[i] || 0);
                  if (deltaVol > maxDeltaVol) {
                    maxDeltaVol = deltaVol;
                  }
                  if (deltaVol < minDeltaVol) {
                    minDeltaVol = deltaVol;
                  }
                }
                return [deltaVol, maxDeltaVol, minDeltaVol, totalDeltaVol];
              }

              function isDateGreaterThanApril15(dateString) {
                // Split the date string into day and month parts
                var parts = dateString.split("/");

                // JavaScript Date uses 0-indexed months, so subtract 1 from the month
                var month = parseInt(parts[1]) - 1;
                var day = parseInt(parts[0]);

                // Create a Date object for April 15th
                var april15th = new Date(new Date().getFullYear(), 3, 16); // Month is 3 (April is 3rd month)

                // Create a Date object for the given date
                var inputDate = new Date(new Date().getFullYear(), month, day);

                // Compare the input date with April 15th
                return inputDate > april15th;
              }

              function GetY(deltaY, distanceScreenY, offsetPercent, value) {
                var num = (distanceScreenY / 100.0) * offsetPercent;
                return (
                  distanceScreenY -
                  1.0 * num -
                  ((distanceScreenY - 2.0 * num) / deltaY) * value
                );
              }
              function getMinNonZeroValue(integerList) {
                if (integerList.length === 0) {
                  return null; // Return null if the list is empty
                }

                let min = integerList[0]; // Assume the first element as minimum

                // Iterate through the list
                for (let i = 1; i < integerList.length; i++) {
                  if (integerList[i] < min) {
                    min = integerList[i]; // Update min if current element is smaller
                  }
                }

                return min; // Return the minimum value
              }

              function getMaxNonZeroValue(integerList) {
                if (integerList.length === 0) {
                  return null; // Return null if the list is empty
                }

                let max = integerList[0]; // Assume the first element as minimum

                // Iterate through the list
                for (let i = 1; i < integerList.length; i++) {
                  if (integerList[i] > max) {
                    max = integerList[i]; // Update min if current element is smaller
                  }
                }

                return max; // Return the minimum value
              }

              var arrayOfCumDelta = [];

              function addOneMinuteToUnixTime(unixTime) {
                // Convert Unix time to milliseconds
                // const milliseconds = unixTime * 1000;
                // Add 1 minute (60 seconds) in milliseconds
                const newMilliseconds = unixTime - (60 * 1000);
                
                // Convert back to Unix time (in seconds)
                return Math.floor(newMilliseconds);
            }

              async function getTradesBetweenTimes(symbol, startTime, endTime) {
                const apiKey = 'Ew7C5GgWbF2HJ7dNkpVeSTuUATVUrdX7';
                const apiUrl = 
                `https://api.polygon.io/v3/trades/AAPL?timestamp.gt=${startTime.toString()}000000&timestamp.lt=${endTime.toString()}000000&order=asc&limit=500&apiKey=${apiKey}`;
             
                try {
                    const response = await fetch(apiUrl);
                    const data = await response.json();
                    console.log("Data returned is " + data.results);
                    return data.results;
                } catch (error) {
                    console.error('Error fetching trade data:', error);
                    return null;
                }
            }

              function calculateVolumeDelta(trades) {
                let buyVolume = 0;
                let sellVolume = 0;
                for (let i = 1; i < trades.length; i++) {
                  const currentElement = trades[i];
                  const previousElement = trades[i - 1];
                  
                  // Compare current element with previous element
                  if (currentElement.price > previousElement.price) {
                    buyVolume += currentElement.size;
                  } else if (currentElement.price < previousElement.price) {
                    sellVolume += currentElement.size;
                  }  
              }
                // trades.forEach((trade) => {
                //   if (trade.v > 0) {
                //     if (trade.c > trade.o) {
                //     } else {
                //       sellVolume += trade.v;
                //     }
                //   }
                // });

                return buyVolume - sellVolume;
              }

              this.main = function (context, inputCallback) {
                this._context = context ;
                this._input = inputCallback;
                // Select the main symbol
                // this._context.select_sym(0);
                // const mainSymbolTime = this._context.new_var(
                //   this._context.symbol.time
                // );
                var unixTimestamp = this._context.symbol.time;

                //yeah we can pass bar start and endtime to trades api and fetch all the trades for that bar
                //api.polygon.io/v3/trades/AAPL?timestamp=2024-04-18&limit=500&sort=timestamp&apiKey=Ew7C5GgWbF2HJ7dNkpVeSTuUATVUrdX7
                const date = new Date(unixTimestamp);
                const localDate =  date.toLocaleDateString();

                var isGreaterThanApril15 = isDateGreaterThanApril15(localDate);

                if (!isGreaterThanApril15) {
                  return;
                }

                const symbol = 'AAPL';
const startTime = addOneMinuteToUnixTime(this._context.symbol.time );
const endTime = this._context.symbol.time ;

getTradesBetweenTimes(symbol, startTime, endTime)
    .then(trades => {
        const volumeDelta = calculateVolumeDelta(trades);
        console.log('Volume delta:', volumeDelta);
    })
    .catch(error => {
        console.error('Error getting trades:', error);
    });

                const i = PineJS.Std.close(this._context);
                const previousClose = this._context.new_unlimited_var(i);
                var res = upAndDownVolume(
                  PineJS.Std.close(this._context),
                  previousClose,
                  PineJS.Std.open(this._context),
                  PineJS.Std.volume(this._context)
                );
                const diffVolArray: IPineSeries =
                  this._context.new_unlimited_var(res);

                const openVal = PineJS.Std.open(this._context);

                // Get local date and time components

                // console.log("last is " + s)
                //       var prevLast = this._input(0);
                //       var laast = this._input(1);

                const [maxVolume, minVolume, lastVolume]: [
                  number,
                  number,
                  number
                ] = getHighLow(diffVolArray);
                const cumLastVolume = this._context.new_var(lastVolume + res);

                var vol = PineJS.Std.volume(this._context);
                var volRes = i > previousClose ? vol : -vol;
                var volumeDelta = PineJS.Std.cum(volRes, this._context);
                // Calculate cumulative volume delta
                var cumulativeVolumeDelta = PineJS.Std.cum(
                  volumeDelta,
                  this._context
                );

                //   const s = this._context.new_var(i);
                //   var res = upAndDownVolume(
                //     PineJS.Std.close(this._context),
                //     s,
                //     PineJS.Std.open(this._context),
                //     PineJS.Std.volume(this._context)
                //   );
                //   const lastVol = PineJS.Std.cum(lastVolume + openVal, this._context);
                //   for (var v = 0; i < close.length; v++) {
                //     tickVol.push(close[v] > open[v] ? volume[v] : close[i] < open[i] ? -volume[i] : 0.0);
                // }
                var tickVol;
                if (PineJS.Std.close(this._context) > previousClose.get(1)) {
                  tickVol = vol;
                } else if (
                  PineJS.Std.close(this._context) < previousClose.get(1)
                ) {
                  tickVol = vol * -1;
                } else {
                  tickVol = 0.0;
                }
                // const volDelta: IPineSeries = this._context.new_unlimited_var(tickVol);

                var totalcumulativeVolumeDelta = PineJS.Std.cum(
                  tickVol,
                  this._context
                );
                // var historyCumVDelta =
                // this._context.n(totalcumulativeVolumeDelta).get(1);
                arrayOfCumDelta.push(totalcumulativeVolumeDelta);
                const localTime = date.toLocaleTimeString();

                var min = getMinNonZeroValue(arrayOfCumDelta);
                var max = getMaxNonZeroValue(arrayOfCumDelta);
                var deltaY = max - min;

                var barValue = totalcumulativeVolumeDelta - min;

                var calculatedY = GetY(deltaY, distanceScreenY, 10, barValue);
                // console.log(
                //   "at " +
                //     localDate +
                //     localTime +
                //     " tick val " +
                //     tickVol +
                //     " distance " +
                //     distanceScreenY +
                //     " barvalue " +
                //     barValue +
                //     " y " +
                //     calculatedY
                // );
                // new_var().get

                //   PineJS.Std.close(this._context)

                // this._context.ggt(e, 0) ? t : r.lt(i, 0) ? -t : 0 * t
                return [calculatedY];
              };
            },
          },
        ]);
      },
    };
    var leftVisibleTime;
    const tvWidget = new widget(widgetOptions);
    this._tvWidget = tvWidget;
    tvWidget.onChartReady(async () => {
      let watchlist = await this._tvWidget.watchList();
      await this.watchListService.subscribeToWatchlistEvents(watchlist);
    });
    tvWidget.onChartReady(function () {
      tvWidget
        .chart()
        .onVisibleRangeChanged()
        .subscribe(null, function (range) {
          leftVisibleTime = range.from;
          calculateIndicator();
          // var res = tvWidget.chart().getStudyById(null);
          // Use leftVisibleTime for your logic
        });

      function calculateIndicator() {
        // Use leftVisibleBarTime for your indicator logic
        // if (leftVisibleTime !== null) {
        //   console.log(leftVisibleTime);
        //     // Your indicator logic here
        //     // Example: console.log(leftVisibleBarTime);
        // }
      }
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
