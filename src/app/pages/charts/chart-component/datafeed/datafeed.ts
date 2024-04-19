import { Injectable, inject } from "@angular/core";
import { Observable, Subscription, debounceTime, filter, scan } from "rxjs";
import * as uuid from "uuid";
import * as moment from "moment";
import {
  SupportedResolutions,
  resolutionMapping,
} from "../../../../core/helpers/constants";
import {
  Bar,
  DOMCallback,
  DatafeedConfiguration,
  ErrorCallback,
  GetMarksCallback,
  HistoryCallback,
  IDatafeedChartApi,
  IExternalDatafeed,
  LibrarySymbolInfo,
  Mark,
  OnReadyCallback,
  PeriodParams,
  QuoteData,
  QuotesCallback,
  QuotesErrorCallback,
  ResolutionString,
  ResolveCallback,
  SearchSymbolResultItem,
  SearchSymbolsCallback,
  ServerTimeCallback,
  SubscribeBarsCallback,
  SymbolResolveExtension,
  TimescaleMark,
} from "../../../../../assets/charting_library/charting_library";
import { ChartsDataService } from "../../../../core/services/charts-data.service";
import {
  StockQuote,
  TradeSocket,
  TradingSchedule,
} from "../../../../core/models/api.response.models";
import { WebSocketsService } from "../../../../core/services/web.sockets.service";
@Injectable()
export class ChartDataFeed implements IDatafeedChartApi, IExternalDatafeed {
  holidays: TradingSchedule[] = [];
  subscriptions: { [listenerId: string]: Subscription } = {}; // Dictionary to store observables
  previousBar: { symbol: string; bar: Bar }[] = [];

  private allSymbolsSubscriptions: Map<string, string[]> = new Map<
    string,
    string[]
  >();

  configurationData: DatafeedConfiguration = {
    // Represents the resolutions for bars supported by your datafeed
    supported_resolutions: SupportedResolutions as ResolutionString[],
    // The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
    exchanges: [],
    // The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
    symbols_types: [
      { name: "All", value: "" },
      { name: "Equities", value: "stocks" },
    ],
  };
  constructor(
    private chartDS: ChartsDataService,
    private socketService: WebSocketsService
  ) {
    this.chartDS.getMarketHolidays().then((result) => {
      this.holidays = result;
    });
  }

  getMarks?(
    symbolInfo: LibrarySymbolInfo,
    from: number,
    to: number,
    onDataCallback: GetMarksCallback<Mark>,
    resolution: ResolutionString
  ): void {
    console.log("getMarks to be implemented", symbolInfo, from, to);
  }
  getServerTime = async (callback: ServerTimeCallback) => {
    //let result = await this.chartDS.getMarketStatus();
    //callback(moment(result.serverTime).valueOf()/1000);
  };

  getTimescaleMarks?(
    symbolInfo: LibrarySymbolInfo,
    from: number,
    to: number,
    onDataCallback: GetMarksCallback<TimescaleMark>,
    resolution: ResolutionString
  ): void {
    console.log("to be implemented");
  }
  searchSymbols = async (
    userInput: string,
    exchange: string,
    symbolType: string,
    onResult: SearchSymbolsCallback
  ) => {
    var result = await this.chartDS.getTickers(50, userInput);
    let symbols: SearchSymbolResultItem[] = [];
    result.results.forEach((ticker) => {
      let symbol: SearchSymbolResultItem = {
        symbol: ticker.ticker,
        description: ticker.name,
        type: "stock",
        ticker: ticker.ticker,
        full_name: ticker.name,
        exchange: ticker.primary_exchange,
      };
      symbols.push(symbol);
    });
    onResult(symbols);
  };

  resolveSymbol = async (
    symbolName: string,
    onResolve: ResolveCallback,
    onError: ErrorCallback,
    extension?: SymbolResolveExtension
  ) => {
    try {
      const symbolInfo = (await this.chartDS.getTickerDetail(symbolName))
        .results;
      //let status = await this.chartDS.getMarketStatus();
      let sessionId = "regular";
      let session = "0930-1600";
      // if (status.market !== "open" && status.afterHours) {
      //   sessionId = "postmarket";
      //   session = "1600-2000";
      // }
      // if (status.market !== "open" && status.earlyHours) {
      //   sessionId = "premarket";
      //   session = "0800-0930";
      // }
      let unitId = uuid.v4();
      let symbol: LibrarySymbolInfo = {
        description: symbolInfo.name,
        long_description: symbolInfo.description,
        exchange: symbolInfo.primary_exchange,
        base_name: [symbolInfo.ticker],
        ticker: symbolInfo.ticker,
        has_seconds: true,
        supported_resolutions: SupportedResolutions as ResolutionString[],
        // logo_urls: [
        //   symbolInfo.branding?.icon_url
        //     ? symbolInfo.branding?.icon_url +
        //       "?apiKey=qYb3lAP6ujI1kUWV6MRdxB_PyMfiWY1B"
        //     : undefined,
        // ],
        name: symbolInfo.ticker,
        type: "stock",
        listed_exchange: "",
        timezone: "America/New_York",
        format: "price",
        pricescale: 0.1,
        has_intraday: true,
        has_ticks: true,
        visible_plots_set: "ohlcv",
        has_weekly_and_monthly: true,
        minmov: 0.01,
        unit_id: unitId,
        session: "0930-1600",
        subsession_id: "regular",
        subsessions: [
          {
            description: "Regular Trading Hours",
            id: "regular",
            session: "0930-1600",
          },
          {
            description: "Extended Trading Hours",
            id: "extended",
            session: "0400-2000",
          },
          {
            description: "Premarket",
            id: "premarket",
            session: "0800-0930",
          },
          {
            description: "Postmarket",
            id: "postmarket",
            session: "1600-2000",
          },
        ],
        session_holidays: this.holidays
          .filter((a) => a.status === "closed")
          .map((a) => moment(a.date, "YYYY-MM-DD").format("YYYYMMDD"))
          .join(),
      };

      //const symbolInfo = await getSymbolInfoFromBackend(symbolName, extension);
      if (extension.session === "regular") {
        symbol.session = "0930-1600";
        symbol.subsession_id = "regular";
      } else if (extension.session === "extended") {
        symbol.session = "0400-2000";
        symbol.subsession_id = "extended";
      }

      // if (status.market !== "open" && status.afterHours) {
      //   symbol.session = "postmarket";
      //   symbol.subsession_id = "1600-2000";
      // }
      // if (status.market !== "open" && status.earlyHours) {
      //   symbol.session = "premarket";
      //   symbol.subsession_id = "0800-0930";
      // }
      onResolve(symbol);
    } catch (err) {
      onError(err);
    }
  };

  getBars = async (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    onError: ErrorCallback
  ) => {
    const [multiplier, timeSpan] =
      this.resolutionToNumberAndTimeSpace(resolution);
    let times: moment.unitOfTime.DurationConstructor = "minutes";
    let fromTime = moment(periodParams.from*1000).subtract(1, "week").valueOf();
    switch (timeSpan) {
      case "hour":
        times = "hours";
        fromTime = moment(periodParams.from*1000).subtract(1, "month").valueOf();
        break;
      case "day":
        times = "days";
        fromTime = moment(periodParams.from*1000).subtract(periodParams.countBack*1.2, "days").valueOf();
        break;
      case "month":
        times = "months";
        fromTime = periodParams.from*1000;
        break;
    }
    let bars = (
      await this.chartDS.getBars(
        symbolInfo.ticker,
        multiplier,
        timeSpan,
        fromTime,
        periodParams.to*1000,
        50000
      )
    ).results;
    let chartBars: Bar[] = [];
    if (bars) {
      chartBars = bars.map((bar) => ({
        time: bar.t,
        open: bar.o,
        high: bar.h,
        low: bar.l,
        close: bar.c,
        volume: bar.v,
        test: 1,
      }));

      if (periodParams.firstDataRequest) {
        let previousBar = this.previousBar.find(
          (a) => a.symbol === symbolInfo.ticker
        );
        if (previousBar) {
          previousBar.bar = chartBars[chartBars.length - 1];
        } else {
          this.previousBar.push({
            symbol: symbolInfo.ticker,
            bar: chartBars[chartBars.length - 1],
          });
        }
      }
      onResult(chartBars);
    }
  };

  subscribeBars = async (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void
  ) => {
    let symbol = symbolInfo.ticker;
    this.addSubscriptionToMap(listenerGuid, symbol);
    this.addSubscriptionToMap("B", symbol);
    let observable = this.socketService.multiplexSubscribe(
      { action: "subscribe", symbols: ["T." + symbol] },
      { action: "unsubscribe", symbols: ["T." + symbol] },
      (message) => message.sym === symbol && message.ev === "T"
    );

    // Subscribe to the observable
    this.subscriptions[listenerGuid] = observable.subscribe(
      (message: TradeSocket) => {
        let lastDailyBar = this.previousBar.find(
          (a) => a.symbol === symbolInfo.ticker
        ).bar;
        const index = this.previousBar.findIndex(
          (a) => a.symbol === symbolInfo.ticker
        );
        let bar: Bar;
        let currentTime = moment().utc().valueOf();
        if (currentTime >= lastDailyBar.time) {
          bar = {
            time: currentTime,
            open: message.p,
            high: message.p,
            low: message.p,
            close: message.p,
            volume: message.s,
          };
        } else {
          bar = {
            ...lastDailyBar,
            high: Math.max(lastDailyBar.high, message.p),
            low: Math.min(lastDailyBar.low, message.p),
            close: message.p,
            volume: lastDailyBar.volume + message.s,
          };
        }
        this.previousBar[index].bar = bar;
        onTick(bar);
      }
    );
  };

  unsubscribeBars(listenerGuid: string): void {
    let symbolsByListener = this.allSymbolsSubscriptions.get(listenerGuid);
    let quotesSymbols = this.allSymbolsSubscriptions.get("Q");
    if (
      !(
        quotesSymbols &&
        quotesSymbols.some((a) => symbolsByListener.includes(a))
      )
    ) {
      this.subscriptions[listenerGuid].unsubscribe();
    }
    delete this.subscriptions[listenerGuid];
  }

  getQuotes = async (
    symbols: string[],
    onDataCallback: QuotesCallback,
    onErrorCallback: QuotesErrorCallback
  ) => {
    let data: QuoteData[] = [];
    var snapshots = (await this.chartDS.getAllTickersSnapShot(symbols)).results;
    snapshots.forEach((snapshot) => {
      var quoteData: QuoteData = {
        n: snapshot.ticker,
        s: "ok",
        v: {
          ask: snapshot.last_quote.ask,
          bid: snapshot.last_quote.bid,
          high_price: snapshot.session.high,
          low_price: snapshot.session.low,
          volume: snapshot.session.volume,
          ch: snapshot.session.change,
          chp: snapshot.session.change_percent,
          open_price: snapshot.session.open,
          lp: snapshot.session.price,
          prev_close_price: snapshot.session.previous_close,
          short_name: snapshot.ticker,
        },
      };
      data.push(quoteData);
      console.log(quoteData);
    });
    onDataCallback(data);
  };

  subscribeQuotes = async (
    symbols: string[],
    fastSymbols: string[],
    onRealtimeCallback: QuotesCallback,
    listenerGUID: string
  ) => {
    fastSymbols.forEach((symbol) => {
      this.addSubscriptionToMap(listenerGUID, symbol);
      this.addSubscriptionToMap("Q", symbol);
    });

    fastSymbols.forEach((a) =>
      this.addSubscriptionToMap(
        JSON.stringify({ type: "Q", guid: listenerGUID }),
        a
      )
    );
    let observable = this.socketService
      .multiplexSubscribe(
        {
          action: "subscribe",
          symbols: [
            ...fastSymbols.map((a) => "Q." + a),
            ...fastSymbols.map((a) => "T." + a),
          ],
        },
        {
          action: "unsubscribe",
          symbols: [
            ...fastSymbols.map((a) => "Q." + a),
            ...fastSymbols.map((a) => "T." + a),
          ],
        },
        (message) => fastSymbols.includes(message.sym)
      )
      .subscribe((message: StockQuote | TradeSocket) => {
        let quoteData: QuoteData = {
          n: message.sym,
          s: "ok",
          v: {
            ask: (message as StockQuote)?.ap,
            bid: (message as StockQuote)?.bp,
            lp: (message as TradeSocket)?.p,
            volume: (message as TradeSocket)?.s,
          },
        };
        onRealtimeCallback([quoteData]);
      });

    // Subscribe to the observable
    this.subscriptions[listenerGUID] = observable;

    // setInterval(async () => {
    //   let data: QuoteData[] = [];
    //   var snapshots = (await this.chartDS.getAllTickersSnapShot(symbols))
    //     .results;
    //   snapshots.forEach((snapshot) => {
    //     var quoteData: QuoteData = {
    //       n: snapshot.ticker,
    //       s: "ok",
    //       v: {
    //         ask: snapshot.last_quote.ask,
    //         bid: snapshot.last_quote.bid,
    //         high_price: snapshot.session.high,
    //         low_price: snapshot.session.low,
    //         volume: snapshot.session.volume,
    //         ch: snapshot.session.change,
    //         chp: snapshot.session.change_percent,
    //         open_price: snapshot.session.open,
    //         lp: snapshot.session.price,
    //         prev_close_price: snapshot.session.previous_close,
    //         short_name: snapshot.name,
    //       },
    //     };
    //     data.push(quoteData);
    //   });
    //   console.log('should call afyer 1 miniute')
    //   onRealtimeCallback(data);
    // }, 60 * 1000);
  };

  unsubscribeQuotes = async (listenerGUID: string) => {
    let symbolsByListener = this.allSymbolsSubscriptions.get(listenerGUID);
    let barsSymbols = this.allSymbolsSubscriptions.get("B");
    if (
      !(barsSymbols && barsSymbols.some((a) => symbolsByListener.includes(a)))
    ) {
      this.subscriptions[listenerGUID].unsubscribe();
    }
    delete this.subscriptions[listenerGUID];
  };

  getVolumeProfileResolutionForPeriod?(
    currentResolution: ResolutionString,
    from: number,
    to: number,
    symbolInfo: LibrarySymbolInfo
  ): ResolutionString {
    console.log("to be implemented");
    return "1S" as ResolutionString;
  }
  onReady(callback: OnReadyCallback): void {
    setTimeout(() => {
      callback(this.configurationData);
    }, 0);
  }
  private resolutionToNumberAndTimeSpace = (
    resolution: ResolutionString
  ): [string, string] => {
    return resolutionMapping[resolution] || ["", ""];
  };

  private addSubscriptionToMap(key: string, value: string) {
    if (this.allSymbolsSubscriptions.has(key)) {
      // Key already exists, get the existing array
      const existingArray = this.allSymbolsSubscriptions.get(key);
      if (existingArray) {
        // Add the new value to the existing array
        existingArray.push(value);
      }
    } else {
      // Key doesn't exist, create a new array and set it for the key
      this.allSymbolsSubscriptions.set(key, [value]);
    }
  }

  removeElementFromMap(key: string, value: string) {
    if (this.allSymbolsSubscriptions.has(key)) {
      // Key exists, get the associated array
      const existingArray = this.allSymbolsSubscriptions.get(key);
      if (existingArray) {
        // Check if the value exists in the array
        const index = existingArray.indexOf(value);
        if (index !== -1) {
          // Remove the value from the array
          existingArray.splice(index, 1);
          // If the array is empty, remove the key from the Map
          if (existingArray.length === 0) {
            this.allSymbolsSubscriptions.delete(key);
          }
        }
      }
    }
  }
}
