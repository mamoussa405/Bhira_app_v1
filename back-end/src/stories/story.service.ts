import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoryEntity } from './entities/story.entity';
import { Repository } from 'typeorm';
import { CreateStoryDto } from 'src/users/admin/dto/create-story.dto';
import { IFiles } from 'src/types/files.type';
import { CloudinaryService } from 'nestjs-cloudinary';
import { IConfirmationMessage } from 'src/types/response.type';

/**
 * Service for story related operations.
 * @function createStory - Create a new story.
 */
@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(StoryEntity)
    private readonly storyRepository: Repository<StoryEntity>,
    private readonly cloundinaryService: CloudinaryService,
  ) {}

  /**
   * Create a new story, and return the created story.
   * @param {CreateStoryDto} story - The story to create.
   * @returns {Promise<IConfirmationMessage>} The created story.
   */
  async createStory(
    story: CreateStoryDto,
    files: IFiles,
  ): Promise<IConfirmationMessage> {
    try {
      const storyEntity = this.storyRepository.create(story);
      storyEntity.imageURL = await this.uploadImage(files.image[0]);
      storyEntity.videoURL = await this.uploadVideo(files.video[0]);
      await this.storyRepository.save(storyEntity);

      return { message: 'Story created successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error creating story');
    }
  }

  /**
   * Upload image to cloudinary and return the url.
   * @param {Express.Multer.File} image - The image to upload.
   * @returns {Promise<string>} The url of the uploaded image.
   */
  private async uploadImage(image: Express.Multer.File): Promise<string> {
    const result = await this.cloundinaryService.uploadFile(image, {
      public_id: image.originalname.replace(/\.jpg|\.png|\.jpeg/g, ''),
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
      public_id: video.originalname.replace(/\.mp4|\.mov/g, ''),
      resource_type: 'video',
    });
    return result.url;
  }
}
