import { Room } from './../rooms/room.entity';
import {
  BaseEntity,
  Column,
  Entity,
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

  @OneToMany(() => Room, (room) => room.cinema, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  rooms: Room[];
}
