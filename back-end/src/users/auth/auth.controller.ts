import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { UserEntity } from './entities/user.entity';
import { TransformPhoneNumberPipe } from 'src/custom-pipes/transform-phone-number.pipe';
import { Response } from 'express';

@Controller('auth')
@UsePipes(TransformPhoneNumberPipe)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() user: SignUpDto): Promise<UserEntity> {
    return await this.authService.signUp(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Body() user: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserEntity> {
    return await this.authService.signIn(user, res);
  }
}