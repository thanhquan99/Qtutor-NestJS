import { RolePermission } from './../role-permission/role-permission.entity';
import { UserRole } from './../user-role/userRole.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum RoleName {
  ADMIN = 'Admin',
  CUSTOMER = 'Customer',
  MOVIE_MANAGER = 'Movie Manager',
  THEATER_MANAGER = 'Theater Manager',
}

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty({ example: 'Admin' })
  @Column({ unique: true, type: 'enum', enum: RoleName })
  name: RoleName;

  @OneToMany(() => UserRole, (userRole) => userRole.role, {
    onDelete: 'CASCADE',
  })
  userRoles: UserRole[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role, {
    onDelete: 'CASCADE',
  })
  rolePermissions: RolePermission[];
}
