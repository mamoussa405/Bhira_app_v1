import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from 'src/products/product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateStoryDto } from './dto/create-story.dto';
import { StoryService } from 'src/stories/story.service';
import { IFiles } from 'src/types/files.type';
import { ProfileService } from '../profile/profile.service';
import { IConfirmationMessage } from 'src/types/response.type';
import { IProfile } from '../types/profile.type';
import { OrderService } from 'src/orders/order.service';
import { IClient } from '../types/client.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';

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
    private readonly orderService: OrderService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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
   * Get all the clients that are not confirmed by the admin.
   * @returns {Promise<IClient[]>} The clients.
   */
  async getClients(): Promise<IClient[]> {
    try {
      const clients = await this.userRepository.find({
        where: { confirmedByAdmin: false },
      });
      if (!clients || clients.length === 0)
        throw new NotFoundException('No clients found');
      const clientsArray: IClient[] = [];

      for (const client of clients) {
        clientsArray.push({
          id: client.id,
          name: client.name,
          phoneNumber: client.phoneNumber,
          avatarURL: client.avatarURL,
        });
      }

      return clientsArray;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('Error getting clients');
    }
  }

  /**
   * Create a new product, and return the created product,
   * it uses the ProductService to create the product.
   * @param {CreateProductDto} product - The product to create.
   * @returns {Promise<IConfirmationMessage>} The confirmation message.
   */
  async createProduct(
    product: CreateProductDto,
    images: Express.Multer.File[],
  ): Promise<IConfirmationMessage> {
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
   * @returns {Promise<IConfirmationMessage>} The confirmation message.
   */
  async createStory(
    story: CreateStoryDto,
    files: IFiles,
  ): Promise<IConfirmationMessage> {
    return await this.storyService.createStory(story, files);
  }

  /**
   * Confirm an order by id.
   * @param {number} id - The id of the order to confirm.
   * @returns {Promise<IConfirmationMessage>} The confirmation message.
   */
  async confirmOrder(id: number): Promise<IConfirmationMessage> {
    return await this.orderService.confirmOrder(id);
  }

  /**
   * Confirm a client by id.
   * @param {number} id - The id of the client to confirm.
   * @returns {Promise<IConfirmationMessage>} The confirmation message.
   */
  async confirmClient(id: number): Promise<IConfirmationMessage> {
    try {
      const client = await this.userRepository.findOne({
        where: { id },
      });
      if (!client) throw new NotFoundException('Client not found');
      await this.userRepository.update(id, { confirmedByAdmin: true });

      return { message: 'Client confirmed' };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('Error confirming client');
    }
  }

  /**
   * Cancel an order by id.
   * @param {number} id - The id of the order to cancel.
   * @returns {Promise<IConfirmationMessage>} The confirmation message.
   */
  async cancelOrder(id: number): Promise<IConfirmationMessage> {
    return await this.orderService.cancelOrder(id);
  }

  /**
   * Cancel a client by id.
   * @param {number} id - The id of the client to cancel.
   * @returns {Promise<IConfirmationMessage>} The confirmation message.
   */
  async cancelClient(id: number): Promise<IConfirmationMessage> {
    try {
      const client = await this.userRepository.findOne({
        where: { id },
      });
      if (!client) throw new NotFoundException('Client not found');
      await this.userRepository.delete(id);

      return { message: 'Client canceled' };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('Error canceling client');
    }
  }
}
