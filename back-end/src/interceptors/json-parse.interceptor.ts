import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Interceptor for parsing JSON data from the request body.
 */
@Injectable()
export class JsonParseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    /**
     * Get the request object from the context,
     * and parse the JSON data from the request body,
     * if it exists. This is added to handle the
     * case where the request body is sent as a
     * text string, instead of a JSON object.
     */
    const req = context.switchToHttp().getRequest();
    if (req.body.data) req.body = JSON.parse(req.body.data);

    return next.handle();
  }
}
