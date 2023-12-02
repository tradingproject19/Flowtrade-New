import { Injectable } from "@angular/core";
import { HttpBase } from "./http.base";
import {
  ChartData,
  ChartMetaInfo,
  ChartTemplate,
  ChartTemplateContent,
  StudyTemplateData,
  StudyTemplateMetaInfo,
} from "../../../assets/charting_library/charting_library";
import { TradingViewApiResponse } from "../models/tradingview.api.model";

@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  private apibaseUrl: string = "https://api.flowtrade.com";
  private client: string = "flowtrade.com";
  constructor(private httpBase: HttpBase) {}

  async addOrUpdateWatchList(
    userId: string,
    watchListId: string,
    name: string,
    active: boolean,
    symbols: string[]
  ) {
    let data = {
      userId: userId,
      watchlistId: watchListId,
      watchlistData: {
        id: watchListId,
        name: name,
        active: active,
        symbols: symbols,
      },
    };
    try {
      let result = await this.httpBase.MakePostRequest(
        this.apibaseUrl + "/addOrUpdateWatchList",
        data
      );
      console.log(result);
      return true;
    } catch (error) {}
  }

  async getUserWatchList(userId: string) {
    try {
      let map = new Map<string, any>();
      map.set("userId", userId);
      let result = await this.httpBase.MakeGetRequest(
        this.apibaseUrl + "/getUserWatchList",
        map
      );
      return result;
    } catch (error) {}
  }

  async deleteWatchList(userId: string, watchListId: string) {
    let data = {
      userId: userId,
      watchlistId: watchListId,
    };
    try {
      let result = await this.httpBase.MakePostRequest(
        this.apibaseUrl + "/deleteWatchList",
        data
      );
      console.log(result);
      return true;
    } catch (error) {}
  }

  //charts api
  getAllCharts = async (userId: string): Promise<ChartMetaInfo[]> => {
    let params = new Map<string, any>();
    params.set("user", userId);
    params.set("client", "flowtrade.com");
    let result = await this.httpBase.MakeGetRequest<
      TradingViewApiResponse<ChartMetaInfo[]>
    >(this.apibaseUrl + "/1.1/charts", params);
    return result.data;
  };
  removeChart = async <T extends string | number>(
    id: T,
    userId: string
  ): Promise<void> => {
    let url =
      this.apibaseUrl +
      "/1.1/charts?" +
      `user=${userId}&client=flowtrade.com&chart=${id}`;
    await this.httpBase.MakeDeleteRequest<TradingViewApiResponse<string>>(
      url,
      {}
    );
  };
  saveChart = async (
    chartData: ChartData,
    userId: string
  ): Promise<TradingViewApiResponse<string>> => {
    let url =
      this.apibaseUrl + "/1.1/charts?" + `user=${userId}&client=flowtrade.com`;

    if (chartData.id !== null && chartData.id !== undefined) {
      url += `&chart=${chartData.id}`;
    }
    let params = {
      name: chartData.name,
      content: chartData.content,
      symbol: chartData.symbol,
      resolution: chartData.resolution,
    };
    return await this.httpBase.MakePostRequest<TradingViewApiResponse<string>>(
      url,
      params
    );
  };
  getChartContent = async (
    chartId: number,
    userId: string
  ): Promise<string> => {
    let params = new Map<string, any>();
    params.set("user", userId);
    params.set("client", "flowtrade.com");
    params.set("chart", chartId);
    let result = await this.httpBase.MakeGetRequest<
      TradingViewApiResponse<ChartData>
    >(this.apibaseUrl + "/1.1/charts", params);
    return result?.data?.content;
  };
  getAllStudyTemplates = async (
    userId: string
  ): Promise<StudyTemplateMetaInfo[]> => {
    let map = new Map<string, any>();
    map.set("client", this.client);
    map.set("user", userId);

    let result = await this.httpBase.MakeGetRequest<
      TradingViewApiResponse<StudyTemplateMetaInfo[]>
    >(this.apibaseUrl + "/1.1/study_templates", map);
    return result?.data;
  };
  removeStudyTemplate = async (
    studyTemplateInfo: StudyTemplateMetaInfo,
    userId: string
  ): Promise<void> => {
    let url =
      this.apibaseUrl +
      "/1.1/study_templates?" +
      `user=${userId}&client=${this.client}&template=${studyTemplateInfo.name}`;
    await this.httpBase.MakeDeleteRequest<TradingViewApiResponse<string>>(
      url,
      {}
    );
  };
  saveStudyTemplate = async (
    studyTemplateData: StudyTemplateData,
    userId: string
  ): Promise<void> => {
    let url =
      this.apibaseUrl +
      "/1.1/study_templates?" +
      `user=${userId}&client=flowtrade.com`;
    let params = {
      name: studyTemplateData.name,
      content: studyTemplateData.content,
    };
    await this.httpBase.MakePostRequest<TradingViewApiResponse<string>>(
      url,
      params
    );
  };
  getStudyTemplateContent = async (
    studyTemplateInfo: StudyTemplateMetaInfo,
    userId: string
  ): Promise<string> => {
    let url =
      this.apibaseUrl +
      "/1.1/study_templates?" +
      `user=${userId}&client=${this.client}&template=${studyTemplateInfo.name}`;
    let result = await this.httpBase.MakeGetRequest<
      TradingViewApiResponse<StudyTemplateData>
    >(url, new Map<string, any>());
    return result?.data?.content;
  };

  //drawings
  getDrawingTemplates = async (
    toolName: string,
    userId: string
  ): Promise<string[]> => {
    let params = new Map<string, any>();
    params.set("client", this.client);
    params.set("user", userId);
    params.set("toolName", toolName);
    let result = await this.httpBase.MakeGetRequest<
      TradingViewApiResponse<{ name: string; content: string }[]>
    >(this.apibaseUrl + "/1.1/drawing_templates", params);
    return result?.data?.map((a) => a.name);
  };
  loadDrawingTemplate = async (
    toolName: string,
    templateName: string,
    userId: string
  ): Promise<string> => {
    let params = new Map<string, any>();
    params.set("client", this.client);
    params.set("user", userId);
    params.set("toolName", toolName);
    params.set("templateName", templateName);
    let result = await this.httpBase.MakeGetRequest<
      TradingViewApiResponse<{ name: string; content: string }>
    >(this.apibaseUrl + "/1.1/drawing_templates", params);
    return result?.data?.name;
  };
  removeDrawingTemplate = async (
    toolName: string,
    templateName: string,
    userId: string
  ): Promise<void> => {
    let url =
      this.apibaseUrl +
      "/1.1/drawing_templates?" +
      `user=${userId}&client=${this.client}&toolName=${toolName}&templateName=${templateName}`;
    await this.httpBase.MakeDeleteRequest(url, {});
  };
  saveDrawingTemplate = async (
    toolName: string,
    templateName: string,
    content: string,
    userId: string
  ): Promise<void> => {
    let url =
      this.apibaseUrl +
      "/1.1/drawing_templates?" +
      `user=${userId}&client=${this.client}&toolName=${toolName}&templateName=${templateName}`;
    let data = {
      content: content,
    };
    await this.httpBase.MakePostRequest(url, data);
  };
  getChartTemplateContent(
    templateName: string,
    userId: string
  ): Promise<ChartTemplate> {
    return new Promise<any>((data: any) => {});
  }
  getAllChartTemplates(userId: string): Promise<string[]> {
    return new Promise<any>((data: any) => {});
  }
  saveChartTemplate(
    newName: string,
    theme: ChartTemplateContent,
    userId: string
  ): Promise<void> {
    return new Promise<any>((data: any) => {});
  }
  removeChartTemplate(templateName: string, userId: string): Promise<void> {
    return new Promise<any>((data: any) => {});
  }
}
