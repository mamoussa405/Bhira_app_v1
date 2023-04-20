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
import { ProductParamDto } from 'src/products/dto/product.dto';
import { AdminGuard } from '../guards/admin.guard';

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('profile')
  async getProfile(@Req() req: Request) {
    return await this.adminService.getProfile(req['user'].sub);
  }

  @Post('product/create')
  @UseInterceptors(FilesInterceptor('images'), JsonParseInterceptor)
  async createProduct(
    @UploadedFiles(new ValidateFilesPipe(FilesValidation.PRODUCT))
    images: Express.Multer.File[],
    @Body() product: CreateProductDto,
  ) {
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
  ) {
    return await this.adminService.createStory(story, files);
  }

  @Patch('orders/confirm/:id')
  async confirmOrder(@Param() params: ProductParamDto) {
    return await this.adminService.confirmOrder(params.id);
  }

  @Delete('products/delete/:id')
  async deleteProduct(@Param() params: ProductParamDto) {
    return await this.adminService.deleteProduct(params.id);
  }

  @Delete('orders/cancel/:id')
  async cancelOrder(@Param() params: ProductParamDto) {
    return await this.adminService.cancelOrder(params.id);
  }
}
