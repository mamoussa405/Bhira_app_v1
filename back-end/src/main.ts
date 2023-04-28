import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
    }),
  );

  /**
   * Enable cookie parser middleware, it will parse the cookies
   * and set them to the request object.
   */
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
