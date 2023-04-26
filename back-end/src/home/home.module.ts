import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { ProductModule } from 'src/products/product.module';
import { StoryModule } from 'src/stories/story.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryViewEntity } from './entities/story-view.entity';
import { HomeController } from './home.controller';
import { UserEntity } from 'src/users/auth/entities/user.entity';

@Module({
  imports: [
    ProductModule,
    StoryModule,
    TypeOrmModule.forFeature([StoryViewEntity, UserEntity]),
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
