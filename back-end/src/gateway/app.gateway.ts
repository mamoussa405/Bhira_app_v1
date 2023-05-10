import {
  UseGuards,
} from '@nestjs/common';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsGuard } from './ws.guard';


@UseGuards(WsGuard)
@WebSocketGateway()
export class AppGateway implements OnGatewayConnection {
  @WebSocketServer()
  public server: Server;
  public socketId: string;

  handleConnection(client: any, ...args: any[]) {
    this.socketId = client.id;
    console.log(this.socketId);
  }
  
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log('Message received: ');
    return 'Hello world!';
  }
}