import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ticket } from 'src/tickets/ticket.entity';

export enum TICKET_TYPE_NAME {
  NORMAL = 'Normal',
  STUDENT = 'Student',
}

@Entity()
export class TicketType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @OneToMany(() => Ticket, (ticket) => ticket.ticketType, {
    onDelete: 'CASCADE',
  })
  tickets: Ticket[];
}
