import { Role } from './../roles/role.entity';
import { User } from './../users/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserRole extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @OneToOne(() => User, (user) => user.userRole, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn() // specify inverse side as a second parameter
  user: User;

  @ManyToOne(() => Role, (role) => role.userRoles, {
    cascade: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  role: Role;
}
