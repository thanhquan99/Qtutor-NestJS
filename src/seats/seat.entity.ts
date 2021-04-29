import { Room } from './../rooms/room.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

export enum SeatType {
  NORMAL = 'Normal',
  COUPLE = 'Couple',
  VIP = 'Vip',
}

@Entity()
@Unique(['row', 'column', 'room'])
export class Seat extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column()
  row: string;

  @Column()
  column: number;

  @Column()
  type: string;

  @ManyToOne(() => Room, (room) => room.seats, {
    onDelete: 'CASCADE',
  })
  room: Room;
}
