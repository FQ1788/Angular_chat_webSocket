import { Component, OnInit, Input } from '@angular/core';
import { ChatSocketService } from './@service/chat-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  webSocketAPI!: ChatSocketService;
  greeting: string[] = [];

  ngOnInit() {
    this.webSocketAPI = new ChatSocketService(this);
    this.connect();
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
