import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductParamDto, ProductQueryDto } from './dto/product.dto';
import { INormalProduct } from './types/product.type';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('get')
  async getProducts(
    @Query() queries: ProductQueryDto,
  ): Promise<INormalProduct[]> {
    return await this.productService.getProducts(queries.category);
  }

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

  @Delete('delete/:id')
  async deleteProduct(@Param() params: ProductParamDto) {
    return await this.productService.deleteProduct(params.id);
  }
}
