import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { TransformPhoneNumberPipe } from 'src/pipes/transform-phone-number.pipe';
import {
  UpdateAddressDto,
  UpdateNameDto,
  UpdatePhoneNumberDto,
} from './dto/profile.dto';
import { ValidateFilesPipe } from '../pipes/validate-files.pipe';
import { FilesValidation } from '../enums/files-validation.enum';

@Controller('user/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('get')
  async getProfile(@Req() req: Request) {
    return await this.profileService.getProfile(req['user'].sub);
  }

  @Patch('update/name')
  async updateName(@Req() req: Request, @Body() body: UpdateNameDto) {
    return await this.profileService.updateName(req['user'].sub, body.name);
  }

  @Patch('update/avatar')
  @UseInterceptors(FilesInterceptor('avatar'))
  async updateAvatar(
    @Req() req: Request,
    @UploadedFiles(new ValidateFilesPipe(FilesValidation.PROFILE))
    avatar: Express.Multer.File[],
  ) {
    return await this.profileService.updateAvatar(req['user'].sub, avatar[0]);
  }

  @Patch('update/phone')
  @UsePipes(TransformPhoneNumberPipe)
  async updatePhoneNumber(
    @Req() req: Request,
    @Body() body: UpdatePhoneNumberDto,
  ) {
    return await this.profileService.updatePhoneNumber(
      req['user'].sub,
      body.phoneNumber,
    );
  }

  @Patch('update/address')
  async updateAddress(@Req() req: Request, @Body() body: UpdateAddressDto) {
    return await this.profileService.updateAddress(
      req['user'].sub,
      body.address,
    );
  }
}
