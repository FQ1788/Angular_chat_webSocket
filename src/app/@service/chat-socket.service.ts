import { Injectable } from '@angular/core';
import { AppComponent } from '../app.component';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';


@Injectable({
  providedIn: 'root'
})
export class ChatSocketService {
  webSocketEndPoint: string = 'http://172.20.27.74:8080/ws';
  topic: string = "/chat/out";
  stompClient: any;
  appComponent: AppComponent;

  constructor(appComponent: AppComponent){
      this.appComponent = appComponent;
  }

  _connect() {
    console.log("Initialize WebSocket Connection");
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({}, function (frame: any) {
        _this.stompClient.subscribe(_this.topic, function (sdkEvent: any) {
            _this.onMessageReceived(sdkEvent);
        });
    }, this.errorCallBack);
  };

  _disconnect() {
    if (this.stompClient !== null) {
        this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error:any) {
      console.log("errorCallBack -> " + error)
      setTimeout(() => {
          this._connect();
      }, 5000);
  }

  /**
  * Send message to sever via web socket
  * @param {*} message 
  */
  _send(message:any) {
      console.log("calling logout api via web socket");
      this.stompClient.send("/app/chatIn", {}, JSON.stringify(message));
  }

  onMessageReceived(message:any) {
      console.log("Message Recieved from Server :: " + message);
      this.appComponent.handleMessage(JSON.parse(message.body));
  }

}
