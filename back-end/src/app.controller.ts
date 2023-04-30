import { Controller, Get } from '@nestjs/common';
import { Public } from './decorators/public.decorator';

@Controller('app')
export class AppController {
  @Public()
  @Get('status')
  getServerStatus(): string {
    return 'Server is up and running';
  }
}
