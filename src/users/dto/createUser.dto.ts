import { ROLE_NAME } from './../../roles/role.entity';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsNotEmpty()
  @IsEnum(ROLE_NAME, {
    message: `Role name should be in ${Object.keys(ROLE_NAME).filter((item) => {
      return isNaN(Number(item));
    })}}`,
  })
  roleName: ROLE_NAME;
}
