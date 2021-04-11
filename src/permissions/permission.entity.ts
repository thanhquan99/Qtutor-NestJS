import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty({ example: 'Create user' })
  @Column({ unique: true })
  action: string;
}
