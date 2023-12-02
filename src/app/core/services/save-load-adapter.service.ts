import { Injectable } from "@angular/core";
import { FirebaseAuthBackend } from "src/app/authUtils";
import {
  ChartData,
  ChartMetaInfo,
  ChartTemplate,
  ChartTemplateContent,
  IExternalSaveLoadAdapter,
  StudyTemplateData,
  StudyTemplateMetaInfo,
} from "../../../assets/charting_library/charting_library";
import { DatabaseService } from "./database.service";

@Injectable({
  providedIn: "root",
})
export class SaveLoadAdapterService implements IExternalSaveLoadAdapter {
  userId: string;
  constructor(
    private firebaseBackend: FirebaseAuthBackend,
    private httpService: DatabaseService
  ) {
    this.userId = this.firebaseBackend.getAuthenticatedUser().uid;
  }
  getAllCharts = async (): Promise<ChartMetaInfo[]> => {
    let charts = await this.httpService.getAllCharts(this.userId);
    return charts;
  };
  removeChart = async <T extends string | number>(id: T): Promise<void> => {
    await this.httpService.removeChart(id, this.userId);
  };
  saveChart = async (chartData: ChartData): Promise<string> => {
    let result = await this.httpService.saveChart(chartData, this.userId);
    return result?.data;
  };
  getChartContent = async (chartId: number): Promise<string> => {
    let chartContent = await this.httpService.getChartContent(
      chartId,
      this.userId
    );
    return chartContent;
  };

  getAllStudyTemplates = async (): Promise<StudyTemplateMetaInfo[]> => {
    return await this.httpService.getAllStudyTemplates(this.userId);
  };

  removeStudyTemplate = async (
    studyTemplateInfo: StudyTemplateMetaInfo
  ): Promise<void> => {
    await this.httpService.removeStudyTemplate(studyTemplateInfo, this.userId);
  };

  saveStudyTemplate = async (
    studyTemplateData: StudyTemplateData
  ): Promise<void> => {
    await this.httpService.saveStudyTemplate(studyTemplateData, this.userId);
  };
  getStudyTemplateContent = async (
    studyTemplateInfo: StudyTemplateMetaInfo
  ): Promise<string> => {
    return this.httpService.getStudyTemplateContent(
      studyTemplateInfo,
      this.userId
    );
  };

  getDrawingTemplates = async (toolName: string): Promise<string[]> => {
    return await this.httpService.getDrawingTemplates(toolName, this.userId);
  };
  loadDrawingTemplate = async (
    toolName: string,
    templateName: string
  ): Promise<string> => {
    return await this.httpService.loadDrawingTemplate(toolName, templateName, this.userId);
  };
  removeDrawingTemplate = async (
    toolName: string,
    templateName: string
  ): Promise<void> => {
    await this.httpService.removeDrawingTemplate(toolName, templateName,this.userId);
  };
  saveDrawingTemplate = async (
    toolName: string,
    templateName: string,
    content: string
  ): Promise<void> => {
    await this.httpService.saveDrawingTemplate(
      toolName,
      templateName,
      content,
      this.userId
    );
  };

  getChartTemplateContent = async (
    templateName: string
  ): Promise<ChartTemplate> => {
    return new Promise<any>((data: any) => {});
  };
  getAllChartTemplates(): Promise<string[]> {
    return new Promise<any>((data: any) => {});
  }
  saveChartTemplate(
    newName: string,
    theme: ChartTemplateContent
  ): Promise<void> {
    return new Promise<any>((data: any) => {});
  }
  removeChartTemplate(templateName: string): Promise<void> {
    return new Promise<any>((data: any) => {});
  }
}
