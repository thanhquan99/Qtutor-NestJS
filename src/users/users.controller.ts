import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TutorStudent, User } from 'src/db/models';
import { GetUser } from './../auth/get-user.decorator';
import { QueryParams } from './../base/dto/query-params.dto';
import { IdParam } from './../base/params/index';
import { ROLE } from './../constant/index';
import { Role } from './../guards/role.decorator';
import { CreateUserDto, UpdateMeDto, UpdateUserDto } from './dto/index';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  public readonly service = new UsersService();

  @Get('/me')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  getMe(@GetUser() user: User): Promise<User> {
    return this.service.getMe(user.id);
  }

  @Patch('/me')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  updateMe(@GetUser() user: User, @Body() payload: UpdateMeDto): Promise<User> {
    return this.service.updateMe(user.id, payload);
  }

  @Get('/me/notifications')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  getMyNotification(@GetUser() user: User, @Query() query: QueryParams) {
    if (query.filter) {
      query.filter = JSON.parse(query.filter);
    }
    if (query.orderBy) {
      query.orderBy = JSON.parse(query.orderBy);
    }
    query.page = query.page || 1;
    query.perPage = query.perPage || 10;
    return this.service.getMyNotification(user.id, query);
  }

  @Get('/me/notifications/summary')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  getMyNotificationSummary(
    @GetUser() user: User,
  ): Promise<{ total: string; totalUnread: string }> {
    return this.service.getMyNotificationSummary(user.id);
  }

  @Get()
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Role(ROLE.SUPER_ADMIN)
  getMany(
    @Query() query: QueryParams,
    @GetUser() user: User,
  ): Promise<{ results: User[]; total: number }> {
    if (query.filter) {
      query.filter = JSON.parse(query.filter);
    }
    if (query.orderBy) {
      query.orderBy = JSON.parse(query.orderBy);
    }
    query.page = query.page || 1;
    query.perPage = query.perPage || 10;
    return this.service.getUsers(query, user.id);
  }

  @Get('/:id')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Role(ROLE.SUPER_ADMIN)
  getOne(@Param() params: IdParam): Promise<User> {
    return this.service.getOne(params.id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Role(ROLE.SUPER_ADMIN)
  createOne(@Body() payload: CreateUserDto): Promise<User> {
    return this.service.createOne(payload);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Role(ROLE.SUPER_ADMIN)
  updateOne(
    @Body() payload: UpdateUserDto,
    @Param() params: IdParam,
  ): Promise<User> {
    return this.service.updateOne(params.id, payload);
  }

  @Delete('/:id')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Role(ROLE.SUPER_ADMIN)
  deleteOne(@Param() params: IdParam): Promise<{ message: string }> {
    return this.service.deleteOne(params.id);
  }
}
