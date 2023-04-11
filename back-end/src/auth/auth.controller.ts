import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  signup(@Body() dto: AuthDto) {
    console.log('req', dto);
    return this.authService.signup(dto);
  }

  @Post('login')
  login() {
    return this.authService.login();
  }

}
