import { Seat } from './../seats/seat.entity';
import { Cinema } from './../cinemas/cinema.entity';
import { ApiProperty } from '@nestjsx/crud/lib/crud';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  Unique,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Unique(['roomNumber', 'cinema'])
@Entity()
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty({ example: 1 })
  @Column()
  roomNumber: number;

  @ManyToOne(() => Cinema, (cinema) => cinema.rooms, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  cinema: Cinema;

  @OneToMany(() => Seat, (seat) => seat.room, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  seats: Seat[];
}
