import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class WsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToWs().getClient();
    console.log(request);
    return true;
  }
}
