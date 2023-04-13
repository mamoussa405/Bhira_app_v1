import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

/**
 * AuthGuard is a guard that will be used to protect routes,
 * it will check if the request has a valid access_token cookie,
 * if it does, it will set the user to the request object and
 * allow the request, if it doesn't, it will throw an
 * UnauthorizedException.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    /**
     * First, we get the request object from the context
     * Second, we get the access_token from the request cookies
     */
    const request = context.switchToHttp().getRequest();
    const accessToken = request.cookies['access_token'];

    // If there is no access_token, we throw an UnauthorizedException
    if (!accessToken) {
      throw new UnauthorizedException('Unauthorized');
    }
    try {
      /**
       * If there is an access_token, we verify it and set the user
       * to the request object for future use.
       */
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
    return true;
  }
}
