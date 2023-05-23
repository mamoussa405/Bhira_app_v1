import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductParamDto, ProductQueryDto } from './dto/product.dto';
import { IFoundProducts, INormalProduct } from './types/product.type';
import { OrderService } from 'src/orders/order.service';
import { Request } from 'express';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
  ) {}

  @Get('get/:id')
  async getProduct(
    @Param() params: ProductParamDto,
    @Req() req: Request,
  ): Promise<INormalProduct> {
    const product = await this.productService.getProduct(params.id);
    const ordersInCart = await this.orderService.getAddedToCartOrders(
      req['user'].sub,
    );

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imagesURL: product.imagesURL,
      ordersInCart: ordersInCart.length,
    };
  }

  @Get('search')
  async searchProducts(
    @Query() query: ProductQueryDto,
  ): Promise<IFoundProducts> {
    return await this.productService.searchProducts(query.like);
  }
}
