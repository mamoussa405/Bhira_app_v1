import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/users/admin/dto/create-product.dto';
import { CloudinaryService } from 'nestjs-cloudinary';

/**
 * Service for product related operations.
 * @function createProduct - Create a new product.
 */
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly typeormRepository: Repository<ProductEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Create a new product, and return the created product.
   * @param {CreateProductDto} product - The product to create.
   * @returns {Promise<ProductEntity>} The created product.
   */
  async createProduct(
    product: CreateProductDto,
    images: Express.Multer.File[],
  ): Promise<ProductEntity> {
    try {
      const productEntity = this.typeormRepository.create(product);
      productEntity.imagesURL = await this.uploadImages(images);
      return await this.typeormRepository.save(productEntity);
    } catch (error) {
      throw new InternalServerErrorException('Error creating product');
    }
  }

  /**
   * Upload images to cloudinary and return the images URLs.
   * @param {Express.Multer.File[]} images - The images to upload.
   * @returns {Promise<string[]>} The images URLs.
   */
  private async uploadImages(images: Express.Multer.File[]): Promise<string[]> {
    const imagesURL: string[] = [];

    for (const image of images) {
      const result = await this.cloudinaryService.uploadFile(image, {
        /**
         * Here we remove the file extension from the file original name
         * because it will be added automatically by cloudinary.
         */
        public_id: image.originalname.replace(/\.jpg|\.png|\.jpeg/g, ''),
      });
      imagesURL.push(result.url);
    }

    return imagesURL;
  }
}
