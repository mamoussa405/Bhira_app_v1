import { StoryViewEntity } from 'src/home/entities/story-view.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  videoURL: string;

  @Column()
  imageURL: string;

  @OneToMany(() => StoryViewEntity, (storyView) => storyView.story, {
    cascade: true,
  })
  storyViews: StoryViewEntity[];
}
