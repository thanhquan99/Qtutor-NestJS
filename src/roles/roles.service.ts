import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from './role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService extends TypeOrmCrudService<Role> {
  constructor(@InjectRepository(Role) repo) {
    super(repo);
  }
  async createRole(dto: Role) {
    const { name } = dto;
    const role = await this.repo.findOne({ name });
    if (role) {
      throw new BadRequestException('Role is already exist');
    }
    const data = Role.create(dto);
    return data.save();
  }
}
