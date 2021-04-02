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

  @UseGuards(AuthGuard())
  @Override('createOneBase')
  createRole(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Role) {
    return this.service.createRole(dto);
  }

  @Override('createManyBase')
  @UseGuards(AuthGuard())
  createRoles(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<Role>,
  ) {
    return this.base.createManyBase(req, dto);
  }

  @Override('updateOneBase')
  @UseGuards(AuthGuard())
  updateRole(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Role) {
    return this.base.updateOneBase(req, dto);
  }

  @Override('replaceOneBase')
  @UseGuards(AuthGuard())
  replaceRole(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Role) {
    return this.base.replaceOneBase(req, dto);
  }

  @Override('deleteOneBase')
  @UseGuards(AuthGuard())
  deleteDirector(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }
}
