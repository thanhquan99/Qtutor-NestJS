import { Theater } from './../theaters/theater.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class Cinema extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @OneToMany(() => Theater, (theater) => theater.cinema, {
    cascade: true,
  })
  @JoinTable()
  theaters: Theater[];
}
