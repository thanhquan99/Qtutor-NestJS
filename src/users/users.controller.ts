import { User } from 'src/users/user.entity';
import { BaseControllerCRUD } from 'src/base/base-controller-CRUD';
import { QueryParams } from '../base/dto/query-params.dto';
import { PermissionAction } from './../permissions/permission.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/createUser.dto';
import { UsersService } from './users.service';

import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Permissions } from 'src/guards/permissions.decorator';

@UseGuards(AuthGuard())
@Controller('users')
export class UsersController extends BaseControllerCRUD<User> {
  constructor(service: UsersService) {
    super(service);
  }

  @Post()
  @Permissions(PermissionAction.CREATE_USER)
  @UsePipes(ValidationPipe)
  createOne(@Body() createUserDto: CreateUserDto) {
    return this.service.createOne(createUserDto);
  }

  @Get()
  @UsePipes(ValidationPipe)
  @Permissions(PermissionAction.GET_USER)
  getMany(@Query() query: QueryParams) {
    return this.service.getMany(query);
  }
}
