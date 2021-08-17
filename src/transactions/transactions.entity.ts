import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
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

export interface ICinema {
  id: number;
  name: string;
}

export interface IRoom {
  id: number;
  roomNumber: number;
}

export interface IMovie {
  id: number;
  name: string;
}

export interface IShowTime {
  id: number;
  startTime: Date;
  endTime: Date;
}

export interface Detail {
  cinema: ICinema;
  room: IRoom;
  movie: IMovie;
  showtime: IShowTime;
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

  @Column({ type: 'jsonb', nullable: true })
  detail: Detail;

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
