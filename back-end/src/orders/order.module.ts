import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { UserEntity } from 'src/users/auth/entities/user.entity';
import { ProductModule } from 'src/products/product.module';
import { AppGateway } from 'src/app.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, UserEntity]), ProductModule],
  controllers: [OrderController],
  providers: [OrderService, AppGateway],
  exports: [OrderService],
})
export class OrderModule {}
