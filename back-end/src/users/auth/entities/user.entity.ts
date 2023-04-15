import { Exclude } from 'class-transformer';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { StoryEntity } from 'src/stories/entities/story.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column({ default: '' })
  address: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  // !change this to false before production
  @Column({ default: true })
  confirmedByAdmin: boolean;

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @ManyToMany(() => StoryEntity, (story) => story.users)
  stories: StoryEntity[];
}
