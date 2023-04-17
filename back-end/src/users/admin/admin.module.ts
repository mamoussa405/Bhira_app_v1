import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ProductModule } from 'src/products/product.module';
import { StoryModule } from 'src/stories/story.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [ProductModule, StoryModule, MulterModule.register()],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
