import { ProductEntity } from 'src/products/entities/product.entity';
import { UserEntity } from 'src/users/auth/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  buyerName: string;

  @Column()
  buyerPhoneNumber: string;

  @Column()
  shipmentAddress: string;

  @Column()
  orderTime: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column()
  buyConfirmedByUser: boolean;

  @Column()
  buyConfirmedByAdmin: boolean;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.orders)
  product: ProductEntity;
}
