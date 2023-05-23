import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductParamDto, ProductQueryDto } from './dto/product.dto';
import { IFoundProducts, INormalProduct } from './types/product.type';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { Repository } from 'typeorm';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  @Get('get/:id')
  async getProduct(@Param() params: ProductParamDto): Promise<INormalProduct> {
    const product = await this.productService.getProduct(params.id);
    const ordersInCart = await this.orderRepository.find({
      where: { buyConfirmedByUser: false },
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
