import { Injectable } from '@nestjs/common';
import { ProductService } from 'src/products/product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from 'src/products/entities/product.entity';
import { CreateStoryDto } from './dto/create-story.dto';
import { StoryEntity } from 'src/stories/entities/story.entity';
import { StoryService } from 'src/stories/story.service';
import { IFiles } from 'src/types/files.type';
import { ProfileService } from '../profile/profile.service';
import { IConfirmationMessage } from 'src/types/response.type';
import { IProfile } from '../types/profile.type';

/**
 * Service for admin related operations.
 * @function createProduct - Create a new product.
 * @function createStory - Create a new story.
 */
@Injectable()
export class AdminService {
  constructor(
    private readonly productService: ProductService,
    private readonly storyService: StoryService,
    private readonly profileService: ProfileService,
  ) {}

  /**
   * Get the profile of the admin with the given id.
   * @param {number} id - The id of the admin.
   * @returns {Promise<IProfile>} The profile of the admin.
   */
  async getProfile(id: number): Promise<IProfile> {
    return await this.profileService.getAdminProfile(id);
  }

  /**
   * Create a new product, and return the created product,
   * it uses the ProductService to create the product.
   * @param {CreateProductDto} product - The product to create.
   * @returns {Promise<ProductEntity>} The created product.
   */
  async createProduct(
    product: CreateProductDto,
    images: Express.Multer.File[],
  ): Promise<ProductEntity> {
    return await this.productService.createProduct(product, images);
  }

  /**
   * Delete a product by id.
   * @param {number} id - The id of the product to delete.
   * @returns {Promise<IConfirmationMessage>} The confirmation message.
   */
  async deleteProduct(id: number): Promise<IConfirmationMessage> {
    return await this.productService.deleteProduct(id);
  }

  /**
   * Create a new story, and return the created story,
   * it uses the StoryService to create the story.
   * @param {CreateStoryDto} story - The story to create.
   * @returns {Promise<StoryEntity>} The created story.
   */
  async createStory(
    story: CreateStoryDto,
    files: IFiles,
  ): Promise<StoryEntity> {
    return await this.storyService.createStory(story, files);
  }
}
