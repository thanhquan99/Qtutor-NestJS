// import { UserRole } from './../user-role/userRole.entity';
import {
  AfterInsert,
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
@Entity()
export class Showtime extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true})
  startTime: Date;

  @Column({ nullable: true})
  endTime: Date;

  @Column()
  duration: number;  

  @Column()
  advertiseTime: number;

  //movie id
}
