import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductParamDto, ProductQueryDto } from './dto/product.dto';
import { IFoundProducts, INormalProduct } from './types/product.type';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  @Get('get/:id')
  async getProduct(
    @Param() params: ProductParamDto,
    @Req() req: Request,
  ): Promise<INormalProduct> {
    const product = await this.productService.getProduct(params.id);
    const orders = await this.orderRepository.find({
      where: { buyConfirmedByUser: false },
      relations: ['user'],
    });
    const ordersInCart = orders.filter((order) => {
      return order.user.id === req['user'].sub;
    });

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imagesURL: product.imagesURL,
      ordersInCart: ordersInCart ? ordersInCart.length : 0,
    };
  }

  @Get('search')
  async searchProducts(
    @Query() query: ProductQueryDto,
  ): Promise<IFoundProducts> {
    return await this.productService.searchProducts(query.like);
  }
}
