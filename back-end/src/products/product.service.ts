import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/users/admin/dto/create-product.dto';

/**
 * Service for product related operations.
 * @function createProduct - Create a new product.
 */
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly typeormRepository: Repository<ProductEntity>,
  ) {}

  /**
   * Create a new product, and return the created product.
   * @param {CreateProductDto} product - The product to create.
   * @returns {Promise<ProductEntity>} The created product.
   */
  async createProduct(product: CreateProductDto): Promise<ProductEntity> {
    try {
      const productEntity = this.typeormRepository.create(product);
      return await this.typeormRepository.save(productEntity);
    } catch (error) {
      throw new InternalServerErrorException('Error creating product');
    }
  }
}
