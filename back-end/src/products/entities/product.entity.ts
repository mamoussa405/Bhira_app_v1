import { OrderEntity } from 'src/orders/entities/order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalStock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  remainingStock: number;

  @Column()
  isTopMarketProduct: boolean;

  @Column()
  isCurrentTopMarketProduct: boolean;

  @Column({ type: 'varchar', array: true, default: [] })
  imagesURL: string[];

  @OneToMany(() => OrderEntity, (order) => order.product, { cascade: true })
  orders: OrderEntity[];
}
