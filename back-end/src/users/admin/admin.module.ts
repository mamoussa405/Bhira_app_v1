import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ProductModule } from 'src/products/product.module';
import { StoryModule } from 'src/stories/story.module';
import { MulterModule } from '@nestjs/platform-express';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [ProductModule, StoryModule, ProfileModule, MulterModule.register()],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
