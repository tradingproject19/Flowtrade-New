import { Injectable } from "@angular/core";
import { LibrarySymbolInfo } from "../../../assets/charting_library/charting_library";

@Injectable({
  providedIn: "root",
})
export class SymbolsService {
  public symbolsCache: Map<string, LibrarySymbolInfo> = new Map<string, LibrarySymbolInfo>();
  constructor() {}
}
