import { Showtime } from './../showtimes/showtimes.entity';
import { Genre } from './../genres/genre.entity';
import { Director } from './../directors/director.entity';
import { Actor } from './../actors/actor.entity';
import { ApiProperty } from '@nestjsx/crud/lib/crud';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rating } from 'src/ratings/ratings.entity';
export enum Country {
  VN = 'Vietnam',
  AM = 'American',
}

@Entity()
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'string' })
  @Column()
  name: string;

  @ApiProperty({ example: 'VietNam' })
  @Column()
  country: string;

  @ApiProperty({ example: 'string' })
  @Column()
  producer: string;

  @ApiProperty({ example: 'string' })
  @Column()
  description: string;

  @ApiProperty({ example: 'string' })
  @Column()
  trailer: string;  

  @ApiProperty({ example: '2020-01-01' })
  @Column({ type: 'date' })
  releaseDate: Date;

  @ApiProperty({
    example: '{ "mainUrl": "string" , "thumbnailUrl" : "string"}',
  })
  @Column({ type: 'simple-json', nullable: true })
  image: { mainUrl: string; thumbnailUrl: string };

  @ApiProperty({ example: '90' })
  @Column()
  duration: number;

  @ManyToMany(() => Actor, (actor) => actor.movies, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  actors: Actor[];

  @ManyToMany(() => Director, (director) => director.movies, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  directors: Director[];

  @ManyToMany(() => Genre, (genre) => genre.movies, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  genres: Genre[];

  @OneToMany(() => Showtime, (showtime) => showtime.movie, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  showtimes: Showtime[];

  @OneToMany(() => Rating, (rating) => rating.movie, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ratings: Rating[];
}
