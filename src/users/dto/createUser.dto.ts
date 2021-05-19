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
  @IsEnum(
    [ROLE_NAME.CUSTOMER, ROLE_NAME.MOVIE_MANAGER, ROLE_NAME.THEATER_MANAGER],
    {
      message: `Role name should be in ${ROLE_NAME.CUSTOMER},${ROLE_NAME.MOVIE_MANAGER},${ROLE_NAME.THEATER_MANAGER}`,
    },
  )
  roleName: ROLE_NAME;
}
