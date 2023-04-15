import { UserEntity } from 'src/users/auth/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  title: string;

  @Column({ default: '' })
  description: string;

  @ManyToMany(() => UserEntity, (user) => user.stories)
  users: UserEntity[];
}
