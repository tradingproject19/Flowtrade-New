import { Injectable } from "@angular/core";
import { HttpBase } from "./http.base";
import {
  AggsResult,
  ApiResponse,
  ApiResponseObject,
  MarketData,
  NewsItem,
  Ticker,
  TickerDetail,
  TickerSnapshot,
  TradingSchedule,
} from "../models/api.response.models";

@Injectable({
  providedIn: "root",
})
export class ChartsDataService {
  apiBaseUrl: string = "https://api.flowtrade.com";
  constructor(private httpBase: HttpBase) {}

  getTickers(limit: number, query: string) {
    var parameters = new Map<string, any>();
    parameters.set("limit", limit);
    parameters.set("query", query);
    return this.httpBase.MakeGetRequestZip<ApiResponse<Ticker>>(
      this.apiBaseUrl + "/gettickers",
      parameters
    );
  }

  getTickerDetail(ticker: string) {
    var url = `https://api.polygon.io/v3/reference/tickers/${ticker}`;
    var parameters = new Map<string, any>();
    parameters.set("next_url", url);
    return this.httpBase.MakeGetRequestZip<ApiResponseObject<TickerDetail>>(
      this.apiBaseUrl + "/getNext",
      parameters
    );
  }

  getMarketHolidays() {
    var url = `https://api.polygon.io/v1/marketstatus/upcoming`;
    var parameters = new Map<string, any>();
    parameters.set("next_url", url);
    return this.httpBase.MakeGetRequestZip<TradingSchedule[]>(
      this.apiBaseUrl + "/getNext",
      parameters
    );
  }

  getBars(
    ticker: string,
    multiplier: string,
    timeSpan: string,
    from: number,
    to: number,
    limit: number
  ) {
    var parameters = new Map<string, any>();
    parameters.set("symbol", ticker);
    parameters.set("multiplier", multiplier);
    parameters.set("fromTime", from);
    parameters.set("toTime", to);
    parameters.set("timespan", timeSpan);
    parameters.set("limit", limit);
    return this.httpBase.MakeGetRequestZip<ApiResponse<AggsResult>>(
      this.apiBaseUrl + "/getAggregates",
      parameters
    );
  }

  getAllTickersSnapShot(tickers: string[]) {
    var parameters = new Map<string, any>();
    parameters.set("tickers", tickers.join());
    return this.httpBase.MakeGetRequestZip<ApiResponse<TickerSnapshot>>(
      this.apiBaseUrl + "/getUniversalSnapshot",
      parameters
    );
  }

  getTickerNews(ticker: string) {
    var parameters = new Map<string, any>();
    parameters.set("ticker", ticker);
    return this.httpBase.MakeGetRequestZip<ApiResponse<NewsItem>>(
      this.apiBaseUrl + "/getTickerNews",
      parameters
    );
  }

  getMarketStatus() {
    var url = `https://api.polygon.io/v1/marketstatus/now`;
    var parameters = new Map<string, any>();
    parameters.set("next_url", url);
    return this.httpBase.MakeGetRequestZip<MarketData>(
      this.apiBaseUrl + "/getNext",
      parameters
    );
  }
}
