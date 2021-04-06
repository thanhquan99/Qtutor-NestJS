import { User } from './user.entity';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createUser(@Body() userDto: UserDto) {
    return this.userService.createUser(userDto);
  }

  @Get()
  getManyUsers() {
    return this.userService.getManyUsers();
  }
}
