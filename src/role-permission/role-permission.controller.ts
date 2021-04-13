import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { RolePermissionService } from './role-permission.service';
import { RolePermission } from './role-permission.entity';
import {
  Body,
  Controller,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateManyDto,
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';

@UseGuards(AuthGuard())
@Crud({
  model: {
    type: RolePermission,
  },
})
@Controller('role-permission')
export class RolePermissionController
  implements CrudController<RolePermission> {
  constructor(public service: RolePermissionService) {}

  get base(): CrudController<RolePermission> {
    return this;
  }

  @Override('getManyBase')
  getRolePermissions(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @Override('getOneBase')
  getRolePermission(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @Override('createOneBase')
  @UsePipes(ValidationPipe)
  createRolePermission(@Body() dto: CreateRolePermissionDto) {
    return this.service.createRolePermission(dto);
  }

  @Override('createManyBase')
  createRolePermissions(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<RolePermission>,
  ) {
    return this.base.createManyBase(req, dto);
  }

  @Override('updateOneBase')
  updateRolePermission(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: RolePermission,
  ) {
    return this.base.updateOneBase(req, dto);
  }

  @Override('replaceOneBase')
  replaceRolePermission(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: RolePermission,
  ) {
    return this.base.replaceOneBase(req, dto);
  }

  @Override('deleteOneBase')
  deleteDirector(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }
}