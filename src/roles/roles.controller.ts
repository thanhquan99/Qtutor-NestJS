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

  @Override('createManyBase')
  createRoles(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<Role>,
  ) {
    return this.base.createManyBase(req, dto);
  }

  @Override('updateOneBase')
  updateRole(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Role) {
    return this.base.updateOneBase(req, dto);
  }

  @Override('replaceOneBase')
  replaceRole(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Role) {
    return this.base.replaceOneBase(req, dto);
  }

  @Override('deleteOneBase')
  deleteDirector(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }
}
