import { UpdateMeDto } from './dto/index';
import { ROLE } from './../constant/index';
import { Role } from './../guards/role.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from './../auth/get-user.decorator';
import { UsersService } from './users.service';
import { User } from 'src/db/models';
import {
  Body,
  Controller,
  Get,
  Patch,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

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
}
