import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsNotEmpty()
  @IsString()
  verifyEmailCode: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
export class ResendEmailDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  resetPasswordCode: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
