import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { IWatchListApi } from "../../../assets/charting_library/charting_library";
import { DatabaseService } from "./database.service";
import { FirebaseAuthBackend } from "src/app/authUtils";

@Injectable({
  providedIn: "root",
})
export class WatchlistService {
  private watchlist: IWatchListApi; // Replace with the actual Watchlist type
  private userId: string;
  constructor(
    private dbService: DatabaseService,
    private firebaseBackend: FirebaseAuthBackend
  ) {
    this.userId = this.firebaseBackend.getAuthenticatedUser().uid;
  }

  async subscribeToWatchlistEvents(watchlist: IWatchListApi) {
    this.watchlist = watchlist;

    let userWatchList: any = await this.dbService.getUserWatchList(this.userId);
    if (userWatchList && userWatchList.watchlists.length > 0) {
      userWatchList.watchlists.forEach((watchlist) => {
        //this.watchlist.deleteList(watchlist.id);
        this.watchlist.saveList({
          id: watchlist.id,
          symbols: watchlist.symbols,
          title: watchlist.name,
        });
        if (watchlist.active) this.watchlist.setActiveList(watchlist.id);
      });
    }

    this.watchlist.onListAdded().subscribe(this, this.onListChanged);
    this.watchlist.onActiveListChanged().subscribe(this, this.onListChanged);
    this.watchlist.onListChanged().subscribe(this, this.onListChanged);
    this.watchlist.onListRemoved().subscribe(this, this.onListRemovedCallback);
    this.watchlist.onListRenamed().subscribe(this, this.onListChanged);
  }

  private async onListChanged() {
    let activeId = this.watchlist.getActiveListId();
    let allLists = this.watchlist.getAllLists();
    if (allLists && allLists[activeId]) {
      await this.dbService.addOrUpdateWatchList(
        this.userId,
        activeId,
        allLists[activeId].title,
        true,
        allLists[activeId].symbols
      );
    }
  }

  onListRemovedCallback = async (watchListId: string) => {
    await this.dbService.deleteWatchList(this.userId, watchListId);
  };
}
