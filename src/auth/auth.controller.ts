import { User } from './../users/user.entity';
import { UserDto } from '../users/dto/user.dto';
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  signUp(@Body(ValidationPipe) userDto: UserDto): Promise<User> {
    return this.authService.signUp(userDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) userDto: UserDto,
  ): Promise<{ accessToken: string; username: string }> {
    return this.authService.signIn(userDto);
  }
}
