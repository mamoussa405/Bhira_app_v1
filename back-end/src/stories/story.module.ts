import { Module } from '@nestjs/common';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryEntity } from './entities/story.entity';
import { UserEntity } from 'src/users/auth/entities/user.entity';
import { StoryViewEntity } from 'src/home/entities/story-view.entity';
import { AppGateway } from 'src/app.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoryEntity, UserEntity, StoryViewEntity]),
  ],
  controllers: [StoryController],
  providers: [StoryService, AppGateway],
  exports: [StoryService],
})
export class StoryModule {}
