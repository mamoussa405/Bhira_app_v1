import {
  BadRequestException,
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
import { INormalProduct, ITopMarketProduct } from './types/product.type';
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
      /**
       * Check if the product is a top market product and if it is, check
       * if the stock is provided.
       */
      if (product.isTopMarketProduct && !product.stock)
        throw new BadRequestException(
          'Stock is required for top market product',
        );
      const productEntity = this.productRepository.create(product);
      productEntity.imagesURL = await this.uploadImages(images);
      /**
       * If the product is a top market product, check if there is a current
       * top market product, and if there is, set the current top market product
       * to false.
       * Set the new product as the current top market product.
       */
      if (productEntity.isTopMarketProduct) {
        const currentTopMarketProduct = await this.productRepository.findOne({
          where: { isCurrentTopMarketProduct: true },
        });
        if (currentTopMarketProduct) {
          await this.productRepository.update(currentTopMarketProduct.id, {
            isCurrentTopMarketProduct: false,
          });
        }
        productEntity.isCurrentTopMarketProduct = true;
      }
      await this.productRepository.save(productEntity);
      return { message: 'Product created successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error creating product');
    }
  }

  /**
   * Get all products.
   * @returns {Promise<INormalProduct[]>} The products.
   */
  async getProducts(): Promise<INormalProduct[]> {
    try {
      const products = await this.productRepository.find({
        where: { isTopMarketProduct: false },
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
   * Get the top market product, if there is one.
   * @throws {NotFoundException} Product not found.
   * @throws {InternalServerErrorException} Error finding product.
   * @returns {Promise<ITopMarketProduct>} The top market product.
   */
  async getTopMarketProduct(): Promise<ITopMarketProduct> {
    try {
      const product = await this.productRepository.findOne({
        where: { isCurrentTopMarketProduct: true },
      });

      if (!product) throw new NotFoundException('Product not found');
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageURL: product.imagesURL[0],
      };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('Error finding product');
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
   * Update a product stock by id, this method will be used when a user
   * buys a top market product or when an admin cancels an order that
   * contains a top market product.
   * @throws {InternalServerErrorException} Error updating product stock.
   * @param {number} id - The id of the product to update.
   * @param {number} stock - The new stock.
   */
  async updateProductStock(id: number, stock: number): Promise<void> {
    try {
      await this.productRepository.update(id, { stock });
    } catch (error) {
      throw new InternalServerErrorException('Error updating product stock');
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
