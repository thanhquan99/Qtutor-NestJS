import { Permission } from './../permissions/permission.entity';
import { Role } from './../roles/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
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
  @JoinColumn()
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  permission: Permission;
}
