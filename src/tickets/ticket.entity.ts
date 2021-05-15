import { User } from 'src/users/user.entity';
import { TicketType } from './../ticket-types/ticket-type.entity';
import { Showtime } from './../showtimes/showtimes.entity';
import { Seat } from './../seats/seat.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Transaction } from 'src/transactions/transactions.entity';

export enum TICKET_STATUS {
  AVAILABLE = 'Available',
  BOOKED = 'Booked',
  HOLD = 'Hold',
  SOLD = 'Sold',
}

@Unique(['seat', 'showtime'])
@Entity()
export class Ticket extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @ManyToOne(() => Seat, (seat) => seat.tickets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  seat: Seat;

  @ManyToOne(() => User, (user) => user.holdTickets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  holder: User;

  @ManyToOne(() => Showtime, (showtime) => showtime.tickets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  showtime: Showtime;

  @ManyToOne(() => TicketType, (ticketType) => ticketType.tickets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  ticketType: TicketType;

  @OneToMany(() => Transaction, (transaction) => transaction.ticket, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  transactions: Transaction[];
}
