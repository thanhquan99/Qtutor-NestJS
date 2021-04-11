import { Permission } from './permission.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PermissionsService extends TypeOrmCrudService<Permission> {
  constructor(@InjectRepository(Permission) repo) {
    super(repo);
  }

  async createPermission(dto: Permission) {
    const { action } = dto;

    if (await this.repo.findOne({ action })) {
      throw new BadRequestException('Permission is already exist');
    }

    const permission = Permission.create(dto);
    return await permission.save();
  }
}
