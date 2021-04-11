import { RolePermission } from './../role-permission/role-permission.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty({ example: 'Create user' })
  @Column({ unique: true })
  action: string;

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission,
    {
      onDelete: 'CASCADE',
    },
  )
  rolePermissions: RolePermission[];
}
