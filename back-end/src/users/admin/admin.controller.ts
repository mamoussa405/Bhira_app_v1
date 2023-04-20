import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { AdminService } from './admin.service';
import { CreateStoryDto } from './dto/create-story.dto';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { JsonParseInterceptor } from 'src/interceptors/json-parse.interceptor';
import { ValidateFilesPipe } from '../pipes/validate-files.pipe';
import { FilesValidation } from '../enums/files-validation.enum';
import { IFiles } from 'src/types/files.type';
import { AdminGuard } from '../guards/admin.guard';
import { IConfirmationMessage } from 'src/types/response.type';
import { IProfile } from '../types/profile.type';
import { IClient } from '../types/client.type';
import { ParamDto } from './dto/params.dto';

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('profile')
  async getProfile(@Req() req: Request): Promise<IProfile> {
    return await this.adminService.getProfile(req['user'].sub);
  }

  @Get('clients/get')
  async getClients(): Promise<IClient[]> {
    return await this.adminService.getClients();
  }

  @Post('product/create')
  @UseInterceptors(FilesInterceptor('images'), JsonParseInterceptor)
  async createProduct(
    @UploadedFiles(new ValidateFilesPipe(FilesValidation.PRODUCT))
    images: Express.Multer.File[],
    @Body() product: CreateProductDto,
  ): Promise<IConfirmationMessage> {
    return await this.adminService.createProduct(product, images);
  }

  @Post('story/create')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image' }, { name: 'video' }]),
    JsonParseInterceptor,
  )
  async createStory(
    @Body() story: CreateStoryDto,
    @UploadedFiles(new ValidateFilesPipe(FilesValidation.STORY)) files: IFiles,
  ): Promise<IConfirmationMessage> {
    return await this.adminService.createStory(story, files);
  }

  @Patch('orders/confirm/:id')
  async confirmOrder(@Param() params: ParamDto): Promise<IConfirmationMessage> {
    return await this.adminService.confirmOrder(params.id);
  }

  @Patch('clients/confirm/:id')
  async confirmClient(
    @Param() params: ParamDto,
  ): Promise<IConfirmationMessage> {
    return await this.adminService.confirmClient(params.id);
  }

  @Delete('products/delete/:id')
  async deleteProduct(
    @Param() params: ParamDto,
  ): Promise<IConfirmationMessage> {
    return await this.adminService.deleteProduct(params.id);
  }

  @Delete('orders/cancel/:id')
  async cancelOrder(@Param() params: ParamDto): Promise<IConfirmationMessage> {
    return await this.adminService.cancelOrder(params.id);
  }

  @Delete('clients/cancel/:id')
  async cancelClient(@Param() params: ParamDto): Promise<IConfirmationMessage> {
    return await this.adminService.cancelClient(params.id);
  }
}
