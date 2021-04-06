import { LoginUserDto } from './../users/dto/loginUser.dto';
import { User } from './../users/user.entity';
import { UserDto } from '../users/dto/user.dto';
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/register')
  signUp(@Body(ValidationPipe) userDto: UserDto) {
    return this.authService.register(userDto);
  }

  @Post('/login')
  signIn(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
