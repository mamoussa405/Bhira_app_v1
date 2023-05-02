import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PublicEnum } from 'src/enums/common.enum';

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
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    /**
     * We use the reflector to get the @Public() decorator that is
     * used to add the IS_PUBLIC_ROUTE metadata to the handler,
     * if it exists, we return true, if it doesn't, we continue,
     * this will allow us to use the @Public() decorator on routes,
     * that we don't want to be protected by the AuthGuard.
     */
    const isPlublic = this.reflector.get<boolean>(
      PublicEnum.IS_PUBLIC_ROUTE,
      context.getHandler(),
    );
    if (isPlublic) return true;
    /**
     * First, we get the request object from the context
     * Second, we get the access_token from the request cookies
     */
    const request = context.switchToHttp().getRequest();
    const accessToken = request.cookies['access_token'];

    // If there is no access_token, we throw an UnauthorizedException
    if (!accessToken) {
      throw new UnauthorizedException('غير مصرح لك بالدخول');
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
      throw new UnauthorizedException('غير مصرح لك بالدخول');
    }
    return true;
  }
}
