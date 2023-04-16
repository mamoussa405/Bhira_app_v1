import { UserEntity } from 'src/users/auth/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToMany(() => UserEntity, (user) => user.stories)
  users: UserEntity[];
}
