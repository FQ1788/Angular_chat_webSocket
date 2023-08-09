import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatSocketService, SocketController } from './@service/chat-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewChecked, SocketController{
  @ViewChild('scrollMe')
  private scrollMe!: ElementRef;

  //宣告ChatSocketService的變數
  webSocketAPI!: ChatSocketService;
  greeting: string[] = [];

  //ngOnInit畫面初始化完畢後執行。
  ngOnInit() {
    this.webSocketAPI = new ChatSocketService(this);
    this.connect();
  }
  
  ngAfterViewChecked(): void {
    this.scrollMe.nativeElement.scrollTop = this.scrollMe.nativeElement.scrollHeight;
  }

  //與後端server連線
  connect(){
    this.webSocketAPI._connect();
  }

  //關閉連線
  disconnect(){
    this.webSocketAPI._disconnect();
  }

  sendMessage(input:HTMLInputElement){
    this.webSocketAPI._send(input.value);
    input.value = "";
  }

  //實作SocketController，收到Service傳送過來的訊息後執行的方法。
  onMessageReceived(message: any){
    //取得service傳過來的資料，request並將body內的資訊轉換為Json格式。
    const data = JSON.parse(message.body);
    
    console.log(data.content);
    this.greeting.push(data.content);
  }
  
  //實作SocketController，發生異常時執行的方法。
  errorCallBack(error: any){
    console.log("連線異常 -> " + error);
    //設定一段時間後重新連線。
    setTimeout(() => {
      this.connect();
    }, 5000);
  }
}
