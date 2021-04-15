import { RolePermission } from './../role-permission/role-permission.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PermissionAction {
  CREATE_MOVIE = 'Create movie',
  UPDATE_MOVIE = 'Update movie',
  DELETE_MOVIE = 'Delete movie',
  GET_USER = 'Get user',
  CREATE_USER = 'Create user',
  UPDATE_USER = 'Update user',
  DELETE_USER = 'Delete user',
  CREATE_GENRE = 'Create genre',
  UPDATE_GENRE = 'Update genre',
  DELETE_GENRE = 'Delete genre',
  CREATE_ACTOR = 'Create actor',
  UPDATE_ACTOR = 'Update actor',
  DELETE_ACTOR = 'Delete actor',
  CREATE_DIRECTOR = 'Create director',
  UPDATE_DIRECTOR = 'Update director',
  DELETE_DIRECTOR = 'Delete director',
  CREATE_CINEMA = 'Create cinema',
  UPDATE_CINEMA = 'Update cinema',
  DELETE_CINEMA = 'Delete cinema',
  CREATE_THEATER = 'Create theater',
  UPDATE_THEATER = 'Update theater',
  DELETE_THEATER = 'Delete theater',
  CREATE_SEAT = 'Create seat',
  UPDATE_SEAT = 'Update seat',
  DELETE_SEAT = 'Delete seat',
  CREATE_SHOWTIME = 'Create showtime',
  UPDATE_SHOWTIME = 'Update showtime',
  DELETE_SHOWTIME = 'Delete showtime',
}

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
