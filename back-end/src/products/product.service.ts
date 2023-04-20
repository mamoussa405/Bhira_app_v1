import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/users/admin/dto/create-product.dto';
import { CloudinaryService } from 'nestjs-cloudinary';
import { INormalProduct } from './types/product.type';
import { IConfirmationMessage } from 'src/types/response.type';

/**
 * Service for product related operations.
 * @function createProduct - Create a new product.
 * @function getProducts - Get all products.
 * @function getProduct - Get a product by id.
 * @function deleteProduct - Delete a product by id.
 * @function uploadImages - Upload images to cloudinary.
 */
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Create a new product, and return the created product.
   * @param {CreateProductDto} product - The product to create.
   * @returns {Promise<IConfirmationMessage>} The confirmation message.
   */
  async createProduct(
    product: CreateProductDto,
    images: Express.Multer.File[],
  ): Promise<IConfirmationMessage> {
    try {
      const productEntity = this.productRepository.create(product);
      productEntity.imagesURL = await this.uploadImages(images);
      await this.productRepository.save(productEntity);

      return { message: 'Product created successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error creating product');
    }
  }

  /**
   * Get all products.
   * @param {string} category - The category of the products to get.
   * @returns {Promise<INormalProduct[]>} The products.
   */
  async getProducts(category: string): Promise<INormalProduct[]> {
    try {
      const products = await this.productRepository.find({
        where: { category, isNormalProduct: true },
      });
      if (!products || !products.length)
        throw new NotFoundException('No Products found');

      return products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        imagesURL: product.imagesURL[0],
      }));
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('Error getting products');
    }
  }

  /**
   * Get a product by id.
   * @param {number} id - The id of the product to get.
   * @returns {Promise<ProductEntity>} The product.
   */
  async getProduct(id: number): Promise<ProductEntity> {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      return product;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('Error finding product');
    }
  }

  /**
   * Delete a product by id.
   * @param {number} id - The id of the product to delete.
   * @returns {Promise<IConfirmationMessage>} The confirmation message.
   */
  async deleteProduct(id: number): Promise<IConfirmationMessage> {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      await this.productRepository.delete({ id });

      return { message: 'Product deleted successfully' };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('Error deleting product');
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
