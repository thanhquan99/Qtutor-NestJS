import { Ticket } from './../tickets/ticket.entity';
import { Movie } from './../movies/movie.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class Showtime extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' })
  startTime: Date;

  @Column({ type: 'timestamptz' })
  endTime: Date;

  @Column()
  advertiseTime: number;

  @ManyToOne(() => Movie, (movie) => movie.showtimes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  movie: Movie;

  @OneToMany(() => Ticket, (ticket) => ticket.showtime, {
    onDelete: 'CASCADE',
  })
  tickets: Ticket[];
}
