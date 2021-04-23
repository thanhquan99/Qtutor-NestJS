import { Theater } from './../theaters/theater.entity';
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
@Unique(['row', 'column', 'theater'])
export class Seat extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column()
  row: string;

  @Column()
  column: number;

  @Column({ type: 'enum', enum: SeatType })
  type: SeatType;

  @ManyToOne(() => Theater, (theater) => theater.seats, {
    onDelete: 'CASCADE',
  })
  theater: Theater;
}
