import { Module } from '@nestjs/common';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryEntity } from './entities/story.entity';
import { UserEntity } from 'src/users/auth/entities/user.entity';
import { StoryViewEntity } from 'src/home/entities/story-view.entity';
import { AppGateway } from 'src/gateway/app.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoryEntity, UserEntity, StoryViewEntity]),
    /**
     * Configure the JwtModule with the config service,
     * we used the Async configuration to inject the ConfigService.
     */
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '5d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [StoryController],
  providers: [StoryService, AppGateway],
  exports: [StoryService],
})
export class StoryModule {}
