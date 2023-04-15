import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  title: string;

  @Column({ default: '' })
  description: string;
}
