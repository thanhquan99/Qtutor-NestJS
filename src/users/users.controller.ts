import { UsersQueryParams } from './dto/index';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/users/user.entity';
import { QueryParams } from '../base/dto/query-params.dto';
import { PermissionAction } from './../permissions/permission.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UsersService } from './users.service';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Permissions } from 'src/guards/permissions.decorator';
import { GetUser } from 'src/auth/get-user.decorator';

@ApiBearerAuth()
@UsePipes(ValidationPipe)
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('/me')
  @Permissions('')
  getMe(@GetUser() user: User): User {
    return this.service.getMe(user);
  }

  @Patch('/me')
  @Permissions('')
  updateMe(
    @GetUser() user: User,
    @Body() updateDto: UpdateUserDto,
  ): Promise<User> {
    return this.service.updateMe(user.id, updateDto);
  }

  @Post()
  @ApiBearerAuth()
  @Permissions(PermissionAction.CREATE_USER)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.service.createUser(createUserDto);
  }

  @Get()
  @ApiBearerAuth()
  @Permissions(PermissionAction.GET_USER)
  adminGetMany(@Query() query: UsersQueryParams, @GetUser() admin: User) {
    if (query?.filter) {
      query.filter = JSON.parse(query.filter);
    }
    if (query?.orderBy) {
      query.orderBy = JSON.parse(query.orderBy);
    }
    return this.service.adminGetMany(query, admin.id);
  }

  @Get('/:id')
  @ApiBearerAuth()
  @Permissions(PermissionAction.GET_USER)
  getOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.service.adminGetOne(id);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @Permissions(PermissionAction.UPDATE_USER)
  adminUpdateUser(
    @Body() updateDto: AdminUpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User> {
    return this.service.adminUpdateUser(updateDto, id);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @Permissions(PermissionAction.DELETE_USER)
  deleteOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void | { message: string }> {
    return this.service.deleteOne(id);
  }
}
