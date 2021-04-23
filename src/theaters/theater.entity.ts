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
} from 'typeorm';

@Unique(['theaterNumber', 'cinema'])
@Entity()
export class Theater extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty({ example: 1 })
  @Column()
  theaterNumber: number;

  @ManyToOne(() => Cinema, (cinema) => cinema.theaters, {
    onDelete: 'CASCADE',
  })
  cinema: Cinema;

  @OneToMany(() => Seat, (seat) => seat.theater, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  seats: Seat[];
}
