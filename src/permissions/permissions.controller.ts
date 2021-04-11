import { PermissionsService } from './permissions.service';
import { Permission } from './permission.entity';
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

@UseGuards(AuthGuard())
@Crud({
  model: {
    type: Permission,
  },
})
@Controller('permissions')
export class PermissionsController implements CrudController<Permission> {
  constructor(public service: PermissionsService) {}

  get base(): CrudController<Permission> {
    return this;
  }

  @Override('getManyBase')
  getPermissions(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @Override('getOneBase')
  getPermission(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @Override('createOneBase')
  createPermission(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Permission,
  ) {
    return this.service.createPermission(dto);
  }

  @Override('createManyBase')
  createPermissions(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<Permission>,
  ) {
    return this.base.createManyBase(req, dto);
  }

  @Override('updateOneBase')
  updatePermission(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Permission,
  ) {
    return this.base.updateOneBase(req, dto);
  }

  @Override('replaceOneBase')
  replacePermission(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Permission,
  ) {
    return this.base.replaceOneBase(req, dto);
  }

  @Override('deleteOneBase')
  deleteDirector(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }
}
