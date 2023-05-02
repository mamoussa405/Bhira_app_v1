import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductService } from 'src/products/product.service';
import { StoryService } from 'src/stories/story.service';
import { IHome } from 'src/types/home.type';
import { IConfirmationMessage } from 'src/types/response.type';
import { StoryViewEntity } from './entities/story-view.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/auth/entities/user.entity';

/**
 * Home service, this will handle all the business logic
 * for the home controller.
 * @function getHome - get home data, including top market product, products and stories.
 * @function viewStory - view story, this will create a new story view if the user has not
 * viewed the story before, otherwise it will return a message that the story has already
 * been viewed. The story view will be created with the current date. It will be called
 * when the user clicks on a story.
 */
@Injectable()
export class HomeService {
  constructor(
    private readonly productSevice: ProductService,
    private readonly storyService: StoryService,
    @InjectRepository(StoryViewEntity)
    private readonly storyViewRepository: Repository<StoryViewEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Get home data, including top market product, products and stories.
   * @throws {NotFoundException} - if no top market product, products or stories found.
   * @throws {InternalServerErrorException} - if error getting home data.
   * @param {number} userId - the logged in user id.
   * @returns {IHome} - the home data.
   */
  async getHome(userId: number): Promise<IHome> {
    try {
      const topMarketProduct = await this.productSevice.getTopMarketProduct();
      const products = await this.productSevice.getProducts();
      const stories = await this.storyService.getStories(userId);

      return {
        stories: stories,
        topMarketProduct: topMarketProduct,
        products: products,
      };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('خطأ في الحصول على البيانات');
    }
  }

  /**
   * View story, this will create a new story view if the user has not
   * viewed the story before, otherwise it will return a message that
   * the story has already been viewed. The story view will be created
   * with the current date. It will be called when the user clicks on
   * a story.
   * @throws {NotFoundException} - if no story found.
   * @throws {InternalServerErrorException} - if error viewing story.
   * @param {number} userId - the logged in user id.
   * @param {number} storyId - the story which the user wants to view.
   * @returns {IConfirmationMessage} - the confirmation message.
   */
  async viewStory(
    userId: number,
    storyId: number,
  ): Promise<IConfirmationMessage> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      const story = await this.storyService.findOne(storyId);
      if (!story) throw new NotFoundException('Story not found');
      const storyView = await this.storyViewRepository.findOne({
        where: { user: { id: userId }, story: { id: storyId } },
      });
      /**
       * Check if the user has already viewed the story.
       * If not, create a new story view.
       */
      if (!storyView) {
        const newStoryView = this.storyViewRepository.create({
          user: user,
          story: story,
          viewedAt: new Date(),
        });
        await this.storyViewRepository.save(newStoryView);
        return { message: 'Story viewed successfully' };
      }
      return { message: 'Story already viewed' };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('خطأ في عرض الستوري');
    }
  }
}
