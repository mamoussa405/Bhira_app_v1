import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoryEntity } from './entities/story.entity';
import { Repository } from 'typeorm';
import { CreateStoryDto } from 'src/users/admin/dto/create-story.dto';

/**
 * Service for story related operations.
 * @function createStory - Create a new story.
 */
@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(StoryEntity)
    private readonly storyRepository: Repository<StoryEntity>,
  ) {}

  /**
   * Create a new story, and return the created story.
   * @param {CreateStoryDto} story - The story to create.
   * @returns {Promise<StoryEntity>} The created story.
   */
  async createStory(story: CreateStoryDto): Promise<StoryEntity> {
    try {
      const storyEntity = this.storyRepository.create(story);
      return await this.storyRepository.save(storyEntity);
    } catch (error) {
      throw new InternalServerErrorException('Error creating story');
    }
  }
}
