//使用 SockJs 需要引入以下兩個套件
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

export class ChatSocketService {
  
  //宣告傳送資料給後端server(SpringBoot)的URL位置。
  webSocketEndPoint: string = 'http://172.20.27.74:8033/ws';
  
  //宣告接收Servert傳資料的URI。
  topic: string = "/chat/out";
  
  //宣告一個變數，存放已連線的物件。
  stompClient: any;

  /* 
    與後端server連線。(SpringBoot)
    接收的兩個參數分別為【收到資料後執行的方法】與【連線異常時的方法】。
  */
  _connect(getMethod:(message:any)=>void, errorMethod:(error:any)=>void) {
    console.log("準備連線~");
    //使用SockJs的套件，取得WebSocket的物件。  EX:初始化參數放後端server接收webSocket的URL。
    let ws = new SockJS(this.webSocketEndPoint);
    //取得連線物件。
    this.stompClient = Stomp.over(ws);
    const _this = this;
    //開始連線~ 。  
    /*
      EX: connect 執行才開始與後端連線。
      第一個參數是與後端溝通的 headers，型態為Map。
      第二個參數為連線後執行的內容，型態為fuction。
      第三個參數為連線發生異常時執行的內容，型態為function。
    */
    _this.stompClient.connect({}, function (frame: any) {
        //stompClient.subscribe 為"訂閱"(監聽) 這個連線從Server傳過來的資料。  
        /* 
          EX: 第一個參數是指定Server的哪個URL發送過來的資料，型態為 String。
              第二個是從後端 Server 接收到資料後要執行的方法，型態為 function 其參數(sdkEvent)為後端傳過來的資料。
        */
        _this.stompClient.subscribe(_this.topic, function (sdkEvent: any) {
          getMethod(sdkEvent);
        });
    },errorMethod);
  };

  //關閉Socket連線的方法
  _disconnect() {
    if (this.stompClient !== null) {
        this.stompClient.disconnect();
    }
    console.log("連線關閉~");
  }

  /**
  * 發送訊息給後端Server的方法。
  * @param {*} message 
  */
  _send(message:any) {
      console.log("發送訊息");
      /**
       * stompClient.send 發送資料給後端Server。
       * EX: 第一個參數後端 Server 為接收訊息的URI，型態為String。
       *     第二個參數為訊息的 Headers，型態為Map。
       *     第三個參數為訊息的 Body，型態為Object(Any)。
       */
      this.stompClient.send("/app/chatIn", {}, JSON.stringify({"message" : message}));
  }
}