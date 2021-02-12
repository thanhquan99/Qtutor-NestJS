import { BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
