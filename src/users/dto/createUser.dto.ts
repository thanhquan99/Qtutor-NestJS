import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(
    [ROLE_NAME.CUSTOMER, ROLE_NAME.MOVIE_MANAGER, ROLE_NAME.THEATER_MANAGER],
    {
      message: `Role name should be in ${ROLE_NAME.CUSTOMER},${ROLE_NAME.MOVIE_MANAGER},${ROLE_NAME.THEATER_MANAGER}`,
    },
  )
  roleName: ROLE_NAME;
}
