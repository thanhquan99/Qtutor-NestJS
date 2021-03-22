import { ApiProperty } from '@nestjsx/crud/lib/crud';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'string' })
  @Column()
  name: string;

  @ApiProperty({ example: 'string' })
  @Column()
  author: string;

  @ApiProperty({ example: 'string' })
  @Column()
  producer: string;

  @ApiProperty({ example: 'string' })
  @Column()
  description: string;

  @ApiProperty({ example: '2020-3-1' })
  @Column({ type: 'date' })
  releaseDate: Date;

  @ApiProperty({
    example: '{ "mainUrl": "string" , "thumbnailUrl" : "string"}',
  })
  @Column({ type: 'simple-json', nullable: true })
  image: { mainUrl: string; thumbnailUrl: string };
}
