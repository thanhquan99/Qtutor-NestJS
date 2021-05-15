import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movie } from 'src/movies/movie.entity';
import { User } from 'src/users/user.entity';
@Entity()
export class Rating extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  comment: string;

  @ManyToOne(() => Movie, (movie) => movie.ratings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  movie: Movie;

  @ManyToOne(() => User, (user) => user.ratings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
