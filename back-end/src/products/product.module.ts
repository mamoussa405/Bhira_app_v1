import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { AppGateway } from 'src/gateway/app.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrderEntity } from 'src/orders/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, OrderEntity]),
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
  controllers: [ProductController],
  providers: [ProductService, AppGateway],
  exports: [ProductService, JwtModule],
})
export class ProductModule {}
