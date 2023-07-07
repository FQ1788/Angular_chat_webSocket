import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatSocketService } from './@service/chat-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe')
  private scrollMe!: ElementRef;

  webSocketAPI!: ChatSocketService;
  greeting: string[] = [];

  ngOnInit() {
    this.webSocketAPI = new ChatSocketService(this);
    this.connect();
  }
  
  ngAfterViewChecked(): void {
    this.scrollMe.nativeElement.scrollTop = this.scrollMe.nativeElement.scrollHeight;
  }

  connect(){
    this.webSocketAPI._connect();
  }

  disconnect(){
    this.webSocketAPI._disconnect();
  }

  sendMessage(input:HTMLInputElement){
    this.webSocketAPI._send(input.value);
    input.value = "";
  }

  handleMessage(message:any){
    console.log(message.content);
    this.greeting.push(message.content);
  }
}
