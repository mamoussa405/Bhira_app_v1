import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { HomeService } from './home.service';
import { Request } from 'express';
import { IHome } from 'src/types/home.type';
import { HomeParamDto } from './dto/home.dto';
import { IConfirmationMessage } from 'src/types/response.type';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  async getHome(@Req() req: Request): Promise<IHome> {
    return await this.homeService.getHome(req['user'].sub);
  }

  @Post('story/:id/view')
  async viewStory(
    @Req() req: Request,
    @Param() params: HomeParamDto,
  ): Promise<IConfirmationMessage> {
    return await this.homeService.viewStory(req['user'].sub, params.id);
  }
}
