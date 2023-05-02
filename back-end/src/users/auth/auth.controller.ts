import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { UserEntity } from './entities/user.entity';
import { TransformPhoneNumberPipe } from 'src/pipes/transform-phone-number.pipe';
import { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { IConfirmationMessage } from 'src/types/response.type';
import { IUserConfirmation } from '../types/user.type';

@Controller('auth')
@UsePipes(TransformPhoneNumberPipe)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signUp(
    @Body() user: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserEntity> {
    return await this.authService.signUp(user, res);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Body() user: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserEntity> {
    return await this.authService.signIn(user, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signout')
  signOut(@Res({ passthrough: true }) res: Response): IConfirmationMessage {
    return this.authService.signOut(res);
  }

  @Get('user-confirmed')
  async checkUserConfirmation(@Req() req: Request): Promise<IUserConfirmation> {
    return await this.authService.checkUserConfirmation(req['user'].sub);
  }
}
