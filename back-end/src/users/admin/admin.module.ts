import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ProductModule } from 'src/products/product.module';
import { StoryModule } from 'src/stories/story.module';
import { MulterModule } from '@nestjs/platform-express';
import { ProfileModule } from '../profile/profile.module';
import { OrderModule } from 'src/orders/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../auth/entities/user.entity';

@Module({
  imports: [
    ProductModule,
    StoryModule,
    ProfileModule,
    OrderModule,
    MulterModule.register(),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
