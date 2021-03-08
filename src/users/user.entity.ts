import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column({ default: false })
  isActive: boolean;

  @Column()
  age: number;
}
