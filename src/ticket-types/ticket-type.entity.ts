import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ticket } from 'src/tickets/ticket.entity';

export enum TicketTypeName {
  NORMAL = 'Normal',
  U22 = 'U22',
  HOLIDAY = 'Holiday',
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
