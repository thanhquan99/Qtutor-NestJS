import { Permission } from './../permissions/permission.entity';
import { Role } from './../roles/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Unique(['role', 'permission'])
@Entity()
export class RolePermission extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty({ example: true })
  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Role, (role) => role.rolePermissions, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinTable()
  permission: Permission;
}
