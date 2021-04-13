import { RolesService } from './roles.service';
import { Role } from './role.entity';
import {
  CreateManyDto,
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Crud({
  model: {
    type: Role,
  },
  routes: {
    only: [
      'getManyBase',
      'getOneBase',
      'createOneBase',
      'updateOneBase',
      'deleteOneBase',
    ],
  },
})
@UseGuards(AuthGuard())
@Controller('roles')
export class RolesController implements CrudController<Role> {
  constructor(public service: RolesService) {}

  get base(): CrudController<Role> {
    return this;
  }

  @Override('getManyBase')
  getRoles(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @Override('getOneBase')
  getRole(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @Override('createOneBase')
  createRole(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Role) {
    return this.service.createRole(dto);
  }

  @Override('updateOneBase')
  updateRole(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Role) {
    return this.base.updateOneBase(req, dto);
  }

  @Override('deleteOneBase')
  deleteDirector(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }
}
