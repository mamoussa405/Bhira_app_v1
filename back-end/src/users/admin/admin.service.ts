import { Injectable } from '@nestjs/common';
import { ProductService } from 'src/products/product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from 'src/products/entities/product.entity';
import { CreateStoryDto } from './dto/create-story.dto';
import { StoryEntity } from 'src/stories/entities/story.entity';
import { StoryService } from 'src/stories/story.service';

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
  ) {}

  /**
   * Create a new product, and return the created product,
   * it uses the ProductService to create the product.
   * @param {CreateProductDto} product - The product to create.
   * @returns {Promise<ProductEntity>} The created product.
   */
  async createProduct(product: CreateProductDto): Promise<ProductEntity> {
    return await this.productService.createProduct(product);
  }

  /**
   * Create a new story, and return the created story,
   * it uses the StoryService to create the story.
   * @param {CreateStoryDto} story - The story to create.
   * @returns {Promise<StoryEntity>} The created story.
   */
  async createStory(story: CreateStoryDto): Promise<StoryEntity> {
    return await this.storyService.createStory(story);
  }
}
