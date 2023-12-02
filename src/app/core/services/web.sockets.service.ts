import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { WebSocketSubject, webSocket } from "rxjs/webSocket";
@Injectable({
  providedIn: "root",
})
export class WebSocketsService {
  socket: WebSocketSubject<any>;
  constructor() {
    // Initialize the WebSocket connection
    this.socket = webSocket('wss://stocks.flowtrade.com');
  }

  // Function to create a multiplexed observable
  multiplexSubscribe(
    subscribeMessage: any,
    unsubscribeMessage: any,
    messageFilter: (message: any) => boolean
  ): Observable<any> {
    const multiplexedObservable = this.socket.multiplex(
      () => subscribeMessage,
      () => unsubscribeMessage,
      message => messageFilter(message)
    );

    return multiplexedObservable;
  }

  // Send a message to the server
  sendMessage(message: any) {
    this.socket.next(message);
  }

}
