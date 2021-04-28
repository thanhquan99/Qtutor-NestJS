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
  export class Transaction extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable: true})
    transaction_time: Date;
  
    @Column({ nullable: true})
    service: string;
  }