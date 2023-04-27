import { Exclude } from 'class-transformer';
import { StoryViewEntity } from 'src/home/entities/story-view.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column()
  address: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  isAdmin: boolean;

  @Column()
  confirmedByAdmin: boolean;

  @Column()
  avatarURL: string;

  @OneToMany(() => OrderEntity, (order) => order.user, { cascade: true })
  orders: OrderEntity[];

  @OneToMany(() => StoryViewEntity, (storyView) => storyView.user, {
    cascade: true,
  })
  storyViews: StoryViewEntity[];
}
