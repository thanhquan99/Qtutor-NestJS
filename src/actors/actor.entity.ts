import { Movie } from './../movies/movie.entity';
import { ApiProperty } from '@nestjsx/crud/lib/crud';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Actor extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty({ example: 'string' })
  @Column()
  name: string;

  @ApiProperty({ example: 'string' })
  @Column()
  description: string;

  @ManyToOne(() => Movie, (movie) => movie.actors)
  movie: Movie;
}
