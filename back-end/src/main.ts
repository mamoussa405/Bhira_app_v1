import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  HttpException,
  ValidationPipe,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './exception-filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Enable global exception filter, this will be applied to all routes,
   * and will catch any exception thrown by the application and send
   * a response with the exception status code and message.
   */
  app.useGlobalFilters(new HttpExceptionFilter());

  /**
   * Enable global validation and transformation pipe,
   * this will be applied to all routes, and will validate
   * and transform the body, query, and params of the request,
   * and it will strip non-whitelisted properties from the body.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
      whitelist: true,
      transform: true,
      exceptionFactory: (errors): HttpException => {
        return new BadRequestException(
          errors[0].constraints[Object.keys(errors[0].constraints)[0]],
        );
      },
    }),
  );

  /**
   * Enable cookie parser middleware, it will parse the cookies
   * and set them to the request object.
   */
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
