import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductParamDto, ProductQueryDto } from './dto/product.dto';
import { IFoundProducts, INormalProduct } from './types/product.type';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('get/:id')
  async getProduct(@Param() params: ProductParamDto): Promise<INormalProduct> {
    const product = await this.productService.getProduct(params.id);

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imagesURL: product.imagesURL,
    };
  }

  @Get('search')
  async searchProducts(
    @Query() query: ProductQueryDto,
  ): Promise<IFoundProducts> {
    return await this.productService.searchProducts(query.like);
  }
}
