import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class AppController {
  @Get('status')
  getServerStatus(): string {
    return 'Server is up and running';
  }
}
