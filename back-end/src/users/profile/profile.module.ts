import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { OrderModule } from 'src/orders/order.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), OrderModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
