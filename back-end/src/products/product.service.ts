import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/users/admin/dto/create-product.dto';
import { CloudinaryService } from 'nestjs-cloudinary';
import { ITopMarketProduct, IFoundProducts } from './types/product.type';
import { IConfirmationMessage } from 'src/types/response.type';
import { AppGateway } from 'src/gateway/app.gateway';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for product related operations.
 * @function createProduct - Create a new product.
 * @function getProducts - Get all products.
 * @function getProduct - Get a product by id.
 * @function deleteProduct - Delete a product by id.
 * @function updateProduct - Update a product by id.
 * @function getTopMarketProduct - Get the top market product.
 * @function setNewTopMarketProduct - Set a new top market product.
 * @function searchProducts - Search for products by name.
 */
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly appGateway: AppGateway,
  ) {}

  /**
   * Create a new product, and return the created product.
   * @param {CreateProductDto} product - The product to create.
   * @returns {Promise<IConfirmationMessage>} The confirmation message.
   * @throws {BadRequestException} Stock is required for top market product.
   * @throws {InternalServerErrorException} Error creating product.
   */
  public async createProduct(
    product: CreateProductDto,
    images: Express.Multer.File[],
  ): Promise<IConfirmationMessage> {
    try {
      /**
       * Check if the product is a top market product and if it is, check
       * if the stock is provided.
       */
      if (product.isTopMarketProduct && !product.stock)
        throw new BadRequestException('المخزون مطلوب لأفضل منتج في السوق');
      /**
       * Check if the product is a top market product and if it is, check
       * if more than one image is provided.
       */
      if (product.isTopMarketProduct && images.length > 1)
        throw new BadRequestException(
          'يُسمح بصورة واحدة فقط لأفضل منتج في السوق',
        );
      const productEntity = this.productRepository.create(product);
      productEntity.imagesURL = await this.uploadImages(images);
      /**
       * If the product is a top market product, check if there is a current
       * top market product, and if there is, set the current top market product
       * to false.
       * Set the new product as the current top market product.
       */
      // TODO: WE should use a transaction here.
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
      const newProduct = await this.productRepository.save(productEntity);
      /**
       * After the product is created, emit the product to the clients,
       * depending on if it is a top market product or not.
       */
      !productEntity.isTopMarketProduct
        ? this.appGateway.server.emit('new-product', {
            id: newProduct.id,
            name: newProduct.name,
            description: newProduct.description,
            price: newProduct.price,
            imagesURL: newProduct.imagesURL[0],
          })
        : this.appGateway.server.emit('new-top-market-product', {
            id: newProduct.id,
            name: newProduct.name,
            description: newProduct.description,
            price: newProduct.price,
            stock: newProduct.stock,
            imageURL: newProduct.imagesURL[0],
          });
      return { message: 'تم إنشاء المنتج بنجاح' };
    } catch (error) {
      if (error.status === HttpStatus.BAD_REQUEST)
        throw new BadRequestException(error.message);
      throw new InternalServerErrorException('خطأ في إنشاء المنتج');
    }
  }
  /**
   * Search for products by name.
   * @param {string} like - The name to search for.
   * @returns {Promise<IFoundProducts>} The found products.
   * @throws {NotFoundException} No Products found.
   * @throws {InternalServerErrorException} Error searching for products.
   */
  public async searchProducts(like: string): Promise<IFoundProducts> {
    try {
      const products = await this.productRepository.find({
        where: { name: ILike(`%${like}%`), isTopMarketProduct: false },
      });
      if (!products || !products.length)
        throw new NotFoundException('لا توجد منتجات');
      return this.foundProducts(products);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('خطأ في الحصول على المنتجات');
    }
  }

  /**
   * Get all products.
   * @returns {Promise<INormalProduct[]>} The products.
   * @throws {NotFoundException} No products found.
   * @throws {InternalServerErrorException} Error getting products.
   */
  public async getProducts(): Promise<IFoundProducts> {
    try {
      const products = await this.productRepository.find({
        where: { isTopMarketProduct: false },
      });

      if (!products || !products.length) return null;
      return this.foundProducts(products);
    } catch (error) {
      throw new InternalServerErrorException('خطأ في الحصول على المنتجات');
    }
  }

  /**
   * Get the top market product, if there is one.
   * @returns {Promise<ITopMarketProduct>} The top market product.
   * @throws {NotFoundException} Product not found.
   * @throws {InternalServerErrorException} Error finding product.
   */
  public async getTopMarketProduct(): Promise<ITopMarketProduct> {
    try {
      const product = await this.productRepository.findOne({
        where: { isCurrentTopMarketProduct: true },
      });

      return !product
        ? null
        : {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            imageURL: product.imagesURL[0],
          };
    } catch (error) {
      throw new InternalServerErrorException('خطأ في العثور على المنتج');
    }
  }

  /**
   * Sets a new top market product to be the top market product
   * white the most stock.
   * @param {number} productId - The id of the old top market product.
   * @returns {Promise<ProductEntity>} The new top market product.
   * @throws {InternalServerErrorException} Error setting new top market product.
   */
  public async setNewTopMarketProduct(
    productId: number,
  ): Promise<ProductEntity> {
    try {
      /**
       * Get all top market products, and order them by stock in descending order,
       * meaning the product with the most stock will be first.
       */
      const topMarketProducts = await this.productRepository.find({
        where: { isTopMarketProduct: true },
        order: { stock: 'DESC' },
      });

      if (
        !topMarketProducts ||
        !topMarketProducts.length ||
        !topMarketProducts[0].stock
      )
        throw new NotFoundException('الصنف غير موجود');
      /**
       * Set the first product in the array as the new top market product,
       * and set the old top market product to false.
       */
      // TODO: We should use a transaction here.
      await this.productRepository.update(topMarketProducts[0].id, {
        isCurrentTopMarketProduct: true,
      });
      await this.productRepository.update(productId, {
        isCurrentTopMarketProduct: false,
      });
      return topMarketProducts[0];
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException(
        'خطأ في تعيين أفضل منتج جديد في السوق',
      );
    }
  }

  /**
   * Get a product by id.
   * @param {number} id - The id of the product to get.
   * @returns {Promise<ProductEntity>} The product.
   * @throws {NotFoundException} Product not found.
   * @throws {InternalServerErrorException} Error finding product.
   */
  public async getProduct(id: number): Promise<ProductEntity> {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
      });

      if (!product) {
        throw new NotFoundException('الصنف غير موجود');
      }
      return product;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('خطأ في العثور على المنتج');
    }
  }

  /**
   * Delete a product by id.
   * @param {number} id - The id of the product to delete.
   * @returns {Promise<IConfirmationMessage>} The confirmation message.
   * @throws {NotFoundException} Product not found.
   * @throws {InternalServerErrorException} Error deleting product.
   */
  public async deleteProduct(id: number): Promise<IConfirmationMessage> {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
      });

      if (!product) {
        throw new NotFoundException('الصنف غير موجود');
      }
      await this.productRepository.delete({ id });
      this.appGateway.server.emit('deleted-product', id);
      return { message: 'تم حذف المنتج بنجاح' };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('خطأ في حذف المنتج');
    }
  }

  /**
   * Update a product stock by id, this method will be used when a user
   * buys a top market product or when an admin cancels an order that
   * contains a top market product.
   * @param {number} id - The id of the product to update.
   * @param {number} stock - The new stock.
   * @throws {InternalServerErrorException} Error updating product stock.
   */
  public async updateProductStock(id: number, stock: number): Promise<void> {
    try {
      await this.productRepository.update(id, { stock });
    } catch (error) {
      throw new InternalServerErrorException('خطأ في تحديث مخزون المنتج');
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
        public_id:
          image.originalname.replace(/\.jpg|\.png|\.jpeg/g, '') +
          '-' +
          uuidv4(),
      });
      imagesURL.push(result.url);
    }

    return imagesURL;
  }

  private foundProducts(products: ProductEntity[]): IFoundProducts {
    const res: IFoundProducts = {
      fruits: [],
      vegetables: [],
      herbes: [],
    };

    for (const product of products) {
      const newProduct = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        imagesURL: product.imagesURL[0],
      };
      if (product.category === 'Fruits') res.fruits.push(newProduct);
      else if (product.category === 'Vegetables')
        res.vegetables.push(newProduct);
      else res.herbes.push(newProduct);
    }
    return res;
  }
}
