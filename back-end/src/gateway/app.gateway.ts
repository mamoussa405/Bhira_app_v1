import { UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
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

  /**
   * Handle connection from client, verify access_token and set
   * a map of userId and socketId.
   * @param {any} client client object
   * @param {any[]} args arguments
   */
  async handleConnection(client: any, ...args: any[]) {
    const accessToken = client.handshake.headers.cookie
      .split('; ')
      .find((cookie: string) => cookie.startsWith('access_token'))
      .split('=')[1];

    if (!accessToken) {
      client.disconnect();
      return;
    }
    try {
      /**
       * If there is an access_token, we verify it and set a map of
       * userId and socketId else we disconnect the client.
       */
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      this.socketId.set(payload['sub'], client.id);
    } catch (error) {
      client.disconnect();
    }
  }

  /**
   * Get socketId of a user.
   * @param {number} userId user id
   * @returns {string} socket id
   */
  public getSocketId(userId: number): string {
    return this.socketId.get(userId);
  }

  /**
   * Delete socketId of a user.
   * @param {number} userId user id
   * @returns {void}
   */
  public deleteSocketId(userId: number): void {
    this.socketId.delete(userId);
  }

  /**
   * Map of userId and socketId.
   */
  private socketId: Map<number, string> = new Map<number, string>();
}
