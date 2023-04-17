import {
  Body,
  Controller,
  Post,
  UploadedFiles,
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
import { ValidateFilesPipe } from './pipes/validate-files.pipe';
import { FilesValidation } from './enums/files-validation.enum';
import { IFiles } from 'src/types/files.type';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create/product')
  @UseInterceptors(FilesInterceptor('images'), JsonParseInterceptor)
  async createProduct(
    @UploadedFiles(new ValidateFilesPipe(FilesValidation.PRODUCT))
    images: Express.Multer.File[],
    @Body() product: CreateProductDto,
  ) {
    return await this.adminService.createProduct(product, images);
  }

  @Post('create/story')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image' }, { name: 'video' }]),
    JsonParseInterceptor,
  )
  async createStory(
    @Body() story: CreateStoryDto,
    @UploadedFiles(new ValidateFilesPipe(FilesValidation.STORY)) files: IFiles,
  ) {
    return await this.adminService.createStory(story, files);
  }
}
