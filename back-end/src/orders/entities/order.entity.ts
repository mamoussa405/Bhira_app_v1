import { ProductEntity } from 'src/products/entities/product.entity';
import { UserEntity } from 'src/users/auth/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderTime: Date;

  @Column()
  quantity: number;

  @Column()
  totalPrice: number;

  @Column()
  isAddedToCart: boolean;

  @Column()
  buyConfirmedByUser: boolean;

  @Column()
  buyConfirmedByAdmin: boolean;

  @Column()
  buyCanceledByAdmin: boolean;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.orders)
  product: ProductEntity;
}
