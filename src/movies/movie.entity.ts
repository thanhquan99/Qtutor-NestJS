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
  RelationId,
} from 'typeorm';
export enum Country {
  VN = 'VietNam',
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
  @Column({ type: 'enum', enum: Country })
  country: Country;

  @ApiProperty({ example: 'string' })
  @Column()
  producer: string;

  @ApiProperty({ example: 'string' })
  @Column()
  description: string;

  @ApiProperty({ example: '2020-01-01' })
  @Column({ type: 'date' })
  releaseDate: Date;

  @ApiProperty({
    example: '{ "mainUrl": "string" , "thumbnailUrl" : "string"}',
  })
  @Column({ type: 'simple-json', nullable: true })
  image: { mainUrl: string; thumbnailUrl: string };

  @ManyToMany(() => Actor, (actor) => actor.movies, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  actors: Actor[];

  @ManyToMany(() => Director, (director) => director.movies, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  directors: Director[];

  @ManyToMany(() => Genre, (genre) => genre.movies, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  genres: Genre[];
}
