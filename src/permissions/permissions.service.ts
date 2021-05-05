import { CreatePermissionDto } from './dto/create-permission.dto';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { Permission } from './permission.entity';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PermissionsService extends BaseServiceCRUD<Permission> {
  constructor(@InjectRepository(Permission) repo) {
    super(repo, Permission, 'permission');
  }

  async createPermission(dto: CreatePermissionDto) {
    const { action } = dto;

    if (await Permission.findOne({ action })) {
      throw new BadRequestException('Permission is already exist');
    }

    const permission = Permission.create(dto);
    return await permission.save();
  }
}
