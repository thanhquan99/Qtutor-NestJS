import { CreatePermissionDto } from './dto/create-permission.dto';
import { BaseControllerCRUD } from 'src/base/base-controller-CRUD';
import { PermissionAction } from 'src/permissions/permission.entity';
import { Permissions } from 'src/guards/permissions.decorator';
import { PermissionsService } from './permissions.service';
import { Permission } from './permission.entity';
import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('permissions')
export class PermissionsController extends BaseControllerCRUD<Permission> {
  constructor(public service: PermissionsService) {
    super(service);
  }

  @Post()
  @Permissions(PermissionAction.GET_USER)
  @UsePipes(ValidationPipe)
  createPermission(
    @Body() createDto: CreatePermissionDto,
  ): Promise<Permission> {
    return this.service.createPermission(createDto);
  }

  @Patch('/:id')
  @Permissions(PermissionAction.GET_USER)
  @UsePipes(ValidationPipe)
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePermissionDto,
  ): Promise<Permission> {
    return this.service.updateOne(id, updateDto);
  }
}
