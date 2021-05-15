import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Ticket } from 'src/tickets/ticket.entity';

export enum TRANSACTION_SERVICE {
  Available = 'Cancel',
  Booked = 'Book',
  Sold = 'Buy',
  Hold = 'Draft',
}

@Entity()
@Unique(['ticket', 'service', 'user'])
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transaction_time: Date;

  @Column()
  service: string;

  @Column()
  price: number;

  @ManyToOne(() => User, (user) => user.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Ticket, (ticket) => ticket.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  ticket: Ticket;
}
