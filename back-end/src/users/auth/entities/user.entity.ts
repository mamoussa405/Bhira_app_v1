import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
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

  @Column({ default: true })
  confirmedByAdmin: boolean;
}
