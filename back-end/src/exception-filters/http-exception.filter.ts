import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    console.log(exception);
    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      message: exception.message,
      error: exception.name,
    });
  }
}
