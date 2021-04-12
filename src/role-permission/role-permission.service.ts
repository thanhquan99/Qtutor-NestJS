import { Permission } from './../permissions/permission.entity';
import { Role } from 'src/roles/role.entity';
import { RolePermission } from './role-permission.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { getManager } from 'typeorm';

@Injectable()
export class RolePermissionService extends TypeOrmCrudService<RolePermission> {
  constructor(@InjectRepository(RolePermission) repo) {
    super(repo);
  }

  async createRolePermission(dto: CreateRolePermissionDto) {
    const { roleId, permissionId } = dto;
    const manager = getManager();

    const role = await manager.findOne(Role, roleId);
    const permission = await manager.findOne(Permission, permissionId);

    if (!role) {
      throw new BadRequestException('Role is not exist');
    }
    if (!permission) {
      throw new BadRequestException('Permission is not exist');
    }

    const rolePermission = await manager
      .createQueryBuilder(RolePermission, 'role_permission')
      .where('"roleId" = :roleId and "permissionId" = :permissionId', {
        roleId,
        permissionId,
      })
      .select()
      .getOne();

    if (rolePermission) {
      throw new BadRequestException('RolePermission is already exist');
    }

    const data = RolePermission.create(dto);
    data.role = role;
    data.permission = permission;
    return await data.save();
  }
}
