import { ProductEntity } from 'src/products/entities/product.entity';
import { UserEntity } from 'src/users/auth/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderTime: Date;

  @Column({ type: 'decimal', precision: 5, default: 0.0 })
  quantity: number;

  @Column({ type: 'decimal', precision: 5, default: 0.0 })
  totalPrice: number;

  @Column({ default: false })
  isAddedToCart: boolean;

  @Column({ default: false })
  buyConfirmedByUser: boolean;

  @Column({ default: false })
  byConfirmedByAdmin: boolean;

  @Column({ default: false })
  buyCanceledByAdmin: boolean;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.orders)
  product: ProductEntity;
}
