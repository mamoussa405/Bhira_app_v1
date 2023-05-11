import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoryEntity } from './entities/story.entity';
import { Repository } from 'typeorm';
import { CreateStoryDto } from 'src/users/admin/dto/create-story.dto';
import { IFiles } from 'src/types/files.type';
import { CloudinaryService } from 'nestjs-cloudinary';
import { IConfirmationMessage } from 'src/types/response.type';
import { UserEntity } from 'src/users/auth/entities/user.entity';
import { StoryViewEntity } from 'src/home/entities/story-view.entity';
import { IStory } from 'src/types/home.type';
import { AppGateway } from 'src/gateway/app.gateway';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for story related operations.
 * @function createStory - Create a new story.
 * @function findOne - Find a story by id.
 * @function getStories - Get all stories.
 */
@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(StoryEntity)
    private readonly storyRepository: Repository<StoryEntity>,
    private readonly cloundinaryService: CloudinaryService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(StoryViewEntity)
    private readonly storyViewRepository: Repository<StoryViewEntity>,
    private readonly appGateway: AppGateway,
  ) {}

  /**
   * Create a new story, and return the created story.
   * @param {CreateStoryDto} story - The story to create.
   * @returns {Promise<IConfirmationMessage>} The created story.
   * @throws {InternalServerErrorException} - If an error occurs.
   */
  public async createStory(
    story: CreateStoryDto,
    files: IFiles,
  ): Promise<IConfirmationMessage> {
    try {
      const storyEntity = this.storyRepository.create(story);
      storyEntity.imageURL = await this.uploadImage(files.image[0]);
      storyEntity.videoURL = await this.uploadVideo(files.video[0]);
      const newStory = await this.storyRepository.save(storyEntity);

      this.appGateway.server.emit('new-story', {
        id: newStory.id,
        title: newStory.title,
        description: newStory.description,
        videoURL: newStory.videoURL,
        imageURL: newStory.imageURL,
        viewedByTheCurrentUser: false,
      });
      return { message: 'تم إنشاء الستوري بنجاح' };
    } catch (error) {
      throw new InternalServerErrorException('خطأ في إضافة الستوري');
    }
  }

  /**
   * Find a story by id, and return the story.
   * @param {number} id - The id of the story to find.
   * @returns {Promise<StoryEntity>} The found story.
   * @throws {NotFoundException} - If the story is not found.
   * @throws {InternalServerErrorException} - If an error occurs.
   */
  public async findOne(id: number): Promise<StoryEntity> {
    try {
      const story = await this.storyRepository.findOne({
        where: { id },
      });

      if (!story) throw new NotFoundException('الستوري غير موجودة');
      return story;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('خطأ في العثور على الستوري');
    }
  }

  /**
   * Find all stories, and return the stories, and whether they are viewed by
   * the current user or not, it return the stories that are not viewed by the
   * current user first, and then the viewed stories if the time difference
   * between the current time and the time the story was viewed is less than 7 days.
   * @param {number} userId - The id of the current user.
   * @returns {Promise<IStory[]>} The found stories.
   * @throws {InternalServerErrorException} - If an error occurs.
   * @throws {NotFoundException} - If no stories are found.
   */
  public async getStories(userId: number): Promise<IStory[]> {
    try {
      /* Get all stories ordered by id ascending. */
      const stories = await this.storyRepository.find({
        order: { id: 'ASC' },
      });
      /* Get the current user, and the stories viewed by the current user. */
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['storyViews'],
      });
      const storyViews: StoryViewEntity[] = [];

      /**
       * load the relations of the stories viewed by the current user, and
       * push them to the storyViews array.
       */
      for (const story of user.storyViews)
        storyViews.push(
          await this.storyViewRepository.findOne({
            where: { id: story.id },
            relations: ['story'],
          }),
        );
      return this.filterStories(stories, storyViews);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('خطأ في الحصول على الستوري');
    }
  }

  /**
   * Filter the stories, and return the stories, and whether they are viewed by
   * the current user or not, it return the stories that are not viewed by the
   * current user first, and then the viewed stories if the time difference
   * between the current time and the time the story was viewed is less than 7 days.
   * @param stories
   * @param storyViews
   * @returns
   */
  private filterStories(
    stories: StoryEntity[],
    storyViews: StoryViewEntity[],
  ): IStory[] {
    const res: IStory[] = [];
    let viewedStoriesPtr = 0;
    let storiesPtr = 0;

    /* If the user has not viewed any stories, return all stories. */
    if (!storyViews || storyViews.length === 0) {
      for (const story of stories)
        res.push({ ...story, viewedByTheCurrentUser: false });
      return res;
    }
    /* Sort the stories by id ascending to reduce the time compexity */
    storyViews.sort((a, b) => a.story.id - b.story.id);
    /**
     * Loop over the viewed stories and push the stories that are not viewed by
     * the current user to the res array, we use two pointers, one for the
     * stories array, and the other for the viewed stories array, and we move
     * the pointers based on the id of the stories, if the id of the story in
     * the stories array is equal to the id of the story in the viewed stories
     * array, we move both pointers, otherwise we move the pointer of the stories
     * array.
     */
    while (viewedStoriesPtr < storyViews.length) {
      if (stories[storiesPtr].id === storyViews[viewedStoriesPtr].story.id) {
        storiesPtr++;
        viewedStoriesPtr++;
      } else {
        res.push({ ...stories[storiesPtr], viewedByTheCurrentUser: false });
        storiesPtr++;
      }
    }
    /* Push the remaining stories to the res array. */
    while (storiesPtr < stories.length)
      res.push({ ...stories[storiesPtr++], viewedByTheCurrentUser: false });

    /**
     * Loop over the viewed stories, and push the stories that are viewed by the
     * current user to the res array if the time difference between the current
     * time and the time the story was viewed is less than 7 days.
     */
    for (const story of storyViews) {
      const currentTime: Date = new Date();
      const timeDiff = currentTime.getTime() - story.viewedAt.getTime();
      /**
       * Get the difference in days, we divide by 1000 to convert the time
       * difference from milliseconds to seconds, and then divide by 3600 to
       * convert the time difference from seconds to hours, and then divide by
       * 24 to convert the time difference from hours to days.
       */
      const diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
      if (diffDays < 7)
        res.push({ ...story.story, viewedByTheCurrentUser: true });
    }
    return res;
  }

  /**
   * Upload image to cloudinary and return the url.
   * @param {Express.Multer.File} image - The image to upload.
   * @returns {Promise<string>} The url of the uploaded image.
   */
  private async uploadImage(image: Express.Multer.File): Promise<string> {
    const result = await this.cloundinaryService.uploadFile(image, {
      public_id:
        image.originalname.replace(/\.jpg|\.png|\.jpeg/g, '') + '-' + uuidv4(),
      resource_type: 'image',
    });
    return result.url;
  }

  /**
   * Upload video to cloudinary and return the url.
   * @param {Express.Multer.File} video - The video to upload.
   * @returns {Promise<string>} The url of the uploaded video.
   */
  private async uploadVideo(video: Express.Multer.File): Promise<string> {
    const result = await this.cloundinaryService.uploadFile(video, {
      public_id:
        video.originalname.replace(/\.mp4|\.mov/g, '') + '-' + uuidv4(),
      resource_type: 'video',
    });
    return result.url;
  }
}
