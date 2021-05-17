import {
  VerifyEmailDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ResendEmailDto,
} from './dto/index';
import { LoginUserDto } from './../users/dto/loginUser.dto';
import { RegisterUserDto } from '../users/dto/registerUser.dto';
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/register')
  register(@Body(ValidationPipe) registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('/login')
  login(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('/verify-email')
  verifyEmail(@Body(ValidationPipe) verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('/forgot-password')
  forgotPassword(@Body(ValidationPipe) forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('/reset-password')
  resetPassword(@Body(ValidationPipe) resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('/resend-email')
  resendEmail(@Body(ValidationPipe) resendEmailDto: ResendEmailDto) {
    return this.authService.resendEmailRegister(resendEmailDto);
  }
}
