import { Movie } from './../movies/movie.entity';
import { ApiProperty } from '@nestjsx/crud/lib/crud';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Director extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty({ example: 'string' })
  @Column()
  name: string;

  @ApiProperty({ example: 'string' })
  @Column()
  description: string;

  @ManyToMany(() => Movie, (movie) => movie.directors, {
    onDelete: 'CASCADE',
  })
  movies: Movie[];
}
