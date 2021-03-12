import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Theater {
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty({ example: 1 })
  @Column()
  theaterNumber: number;
}
