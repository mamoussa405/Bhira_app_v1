import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column({ type: 'decimal', precision: 5, default: 0.0 })
  price: number;

  @Column({ default: '' })
  description: string;

  @Column({ type: 'decimal', precision: 5, default: 0.0 })
  stock: number;

  @Column({ default: true })
  isNormalProduct: boolean;
}
