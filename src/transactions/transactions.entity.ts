// import { UserRole } from './../user-role/userRole.entity';
import {
    AfterInsert,
    BaseEntity,
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import { Ticket } from 'src/tickets/ticket.entity';
  @Entity()
  export class Transaction extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable: true})
    transaction_time: Date;
  
    @Column({ nullable: true})
    service: string;

    @Column({nullable : true})
    price: number;

    @ManyToOne(() => User, (user) => user.transactions, {
      onDelete: 'CASCADE',
    })
    @JoinColumn()
    user: User;

    @OneToOne(() => Ticket, (ticket) => ticket.transaction, {
      nullable: false,
      onDelete: 'CASCADE',
    })
    @JoinColumn() // specify inverse side as a second parameter
    ticket: Ticket;
  }