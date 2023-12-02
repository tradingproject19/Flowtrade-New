import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as pako from "pako";
import { decodeMulti, decode, decodeMultiStream } from "@msgpack/msgpack";
import { unzip } from "unzipit";
import { bl } from "@fullcalendar/core/internal-common";
@Injectable({
  providedIn: "root",
})
export class HttpBase {
  constructor(public http: HttpClient) {}

  MakeGetRequest<T>(url: string, parameters: Map<string, any>) {
    if (!parameters) parameters = new Map<string, any>();
    return new Promise((resolve: (data: T) => void, reject) => {
      let count = 0;
      if (parameters && parameters.size > 0) {
        url += `?`;
        parameters.forEach((value: any, key: string) => {
          count++;
          if (count == 1) {
            url += key + "=" + encodeURIComponent(value);
          } else {
            url += "&" + key + "=" + encodeURIComponent(value);
          }
        });
      }
      this.http.get<T>(url).subscribe({
        next: async (response) => {
          resolve(response);
        },
        error: (error: Response) => {
          reject(error);
        },
      });
    });
  }

  MakeGetRequestZip<T>(url: string, parameters: Map<string, any>) {
    if (!parameters) parameters = new Map<string, any>();
    return new Promise((resolve: (data: T) => void, reject) => {
      let count = 0;
      if (parameters && parameters.size > 0) {
        url += `?`;
        parameters.forEach((value: any, key: string) => {
          count++;
          if (count == 1) {
            url += key + "=" + encodeURIComponent(value);
          } else {
            url += "&" + key + "=" + encodeURIComponent(value);
          }
        });
      }

      const options: any = {
        headers: new HttpHeaders({
          "Content-Type": "application/zip",
          "Access-Control-Allow-Origin": "*",
        }),
        responseType: "arrayBuffer",
      };
      this.http.get<T>(url, options).subscribe({
        next: async (response) => {
          var resp = await this.extractResponse<T>(response);
          resolve(resp);
        },
        error: (error: Response) => {
          reject(error);
        },
      });
    });
  }

  MakePostRequest<T>(url: string, body: any) {
    return new Promise((resolve: (data: any) => void, reject) => {
      this.http.post<T>(url, body).subscribe({
        next: (response) => {
          resolve(response);
        },
        error: (error: Response) => {
          reject(error);
        },
      });
    });
  }


  MakeDeleteRequest<T>(url: string, body: any) {
    return new Promise((resolve: (data: any) => void, reject) => {
      this.http.delete<T>(url, body).subscribe({
        next: (response) => {
          resolve(response);
        },
        error: (error: Response) => {
          reject(error);
        },
      });
    });
  }
  isNullorEmpty(str: string): boolean {
    return str == undefined || str == null || str.length == 0;
  }

  async extractResponse<T>(response: any) {
    var resp = await unzip(response);
    var buffer = await resp.entries["data.msgpack"].arrayBuffer();
    var apiResp = decode(buffer);
    return apiResp as T;
  }
}
