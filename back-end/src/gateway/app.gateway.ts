import { UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsGuard } from './ws.guard';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@UseGuards(WsGuard)
@WebSocketGateway()
export class AppGateway implements OnGatewayConnection {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  @WebSocketServer()
  public server: Server;
  public socketId: Map<number, string> = new Map<number, string>();

  async handleConnection(client: any, ...args: any[]) {
    const accessToken = client.handshake.query.access_token;

    if (!accessToken) throw new UnauthorizedException('غير مصرح لك بالدخول');
    try {
      /**
       * If there is an access_token, we verify it and set the user
       * to the request object for future use.
       */
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      this.socketId.set(payload['sub'], client.id);
    } catch (error) {
      throw new UnauthorizedException('غير مصرح لك بالدخول');
    }
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log('Message received: ');
    return 'Hello world!';
  }
}
