import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { UserEntity } from 'src/users/auth/entities/user.entity';
import { ProductModule } from 'src/products/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    TypeOrmModule.forFeature([UserEntity]),
    ProductModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
