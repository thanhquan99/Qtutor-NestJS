import { TicketType } from './../ticket-types/ticket-type.entity';
import { Showtime } from './../showtimes/showtimes.entity';
import { Seat } from './../seats/seat.entity';
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
import { Transaction } from 'src/transactions/transactions.entity';

export enum TicketStatus {
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

  @OneToOne(() => Transaction, (transaction) => transaction.ticket, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn() // specify inverse side as a second parameter
  transaction: Transaction;
}
