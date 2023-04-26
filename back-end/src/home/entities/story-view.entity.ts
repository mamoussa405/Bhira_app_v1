import { StoryEntity } from 'src/stories/entities/story.entity';
import { UserEntity } from 'src/users/auth/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StoryViewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.storyViews, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => StoryEntity, (story) => story.storyViews, {
    onDelete: 'CASCADE',
  })
  story: StoryEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  viewedAt: Date;
}
