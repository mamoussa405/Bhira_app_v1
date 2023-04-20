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
  UpdatePasswordDto,
  UpdatePhoneNumberDto,
} from './dto/profile.dto';
import { ValidateFilesPipe } from '../pipes/validate-files.pipe';
import { FilesValidation } from '../enums/files-validation.enum';
import { IConfirmationMessage } from 'src/types/response.type';
import { IProfile } from '../types/profile.type';

@Controller('user/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('get')
  async getProfile(@Req() req: Request): Promise<IProfile> {
    return await this.profileService.getProfile(req['user'].sub);
  }

  @Patch('update/name')
  async updateName(
    @Req() req: Request,
    @Body() body: UpdateNameDto,
  ): Promise<IConfirmationMessage> {
    return await this.profileService.updateName(req['user'].sub, body.name);
  }

  @Patch('update/avatar')
  @UseInterceptors(FilesInterceptor('avatar'))
  async updateAvatar(
    @Req() req: Request,
    @UploadedFiles(new ValidateFilesPipe(FilesValidation.PROFILE))
    avatar: Express.Multer.File[],
  ): Promise<IConfirmationMessage> {
    return await this.profileService.updateAvatar(req['user'].sub, avatar[0]);
  }

  @Patch('update/phone')
  @UsePipes(TransformPhoneNumberPipe)
  async updatePhoneNumber(
    @Req() req: Request,
    @Body() body: UpdatePhoneNumberDto,
  ): Promise<IConfirmationMessage> {
    return await this.profileService.updatePhoneNumber(
      req['user'].sub,
      body.phoneNumber,
    );
  }

  @Patch('update/address')
  async updateAddress(
    @Req() req: Request,
    @Body() body: UpdateAddressDto,
  ): Promise<IConfirmationMessage> {
    return await this.profileService.updateAddress(
      req['user'].sub,
      body.address,
    );
  }

  @Patch('update/password')
  async updatePassword(
    @Req() req: Request,
    @Body() body: UpdatePasswordDto,
  ): Promise<IConfirmationMessage> {
    return await this.profileService.updatePassword(req['user'].sub, body);
  }
}
