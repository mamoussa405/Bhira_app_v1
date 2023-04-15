import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { AdminService } from './admin.service';
import { CreateStoryDto } from './dto/create-story.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create/product')
  async createProduct(@Body() product: CreateProductDto) {
    return await this.adminService.createProduct(product);
  }

  @Post('create/story')
  async createStory(@Body() story: CreateStoryDto) {
    return await this.adminService.createStory(story);
  }
}
