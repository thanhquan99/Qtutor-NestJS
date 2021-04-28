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
  export class Rating extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable: true})
    comment: string;
  }