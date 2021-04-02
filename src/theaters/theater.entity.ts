import { Cinema } from './../cinemas/cinema.entity';
import { ApiProperty } from '@nestjsx/crud/lib/crud';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  Unique,
} from 'typeorm';

@Unique(['theaterNumber', 'cinema'])
@Entity()
export class Theater extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty({ example: 1 })
  @Column()
  theaterNumber: number;

  @ManyToOne(() => Cinema, (cinema) => cinema.theaters)
  cinema: Cinema;
}
