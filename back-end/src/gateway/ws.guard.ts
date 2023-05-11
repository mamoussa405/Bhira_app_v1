import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToWs().getClient();
    const accessToken = request.handshake.headers.cookie
      .split(': ')
      .find((cookie: string) => cookie.startsWith('access_token'))
      .split('=')[1];

    if (!accessToken) throw new WsException('غير مصرح لك بالدخول');
    try {
      /**
       * If there is an access_token, we verify it and return true
       * else we throw an exception.
       */
      await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (error) {
      throw new WsException('غير مصرح لك بالدخول');
    }
    return true;
  }
}
