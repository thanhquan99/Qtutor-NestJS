import { ROLE_NAME } from './../../roles/role.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString, IsEnum } from 'class-validator';

export class UsersQueryParams {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderBy: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  filter: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  page: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  perPage: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  relations: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(
    [ROLE_NAME.CUSTOMER, ROLE_NAME.MOVIE_MANAGER, ROLE_NAME.THEATER_MANAGER],
    {
      message: `Role name should be in [${ROLE_NAME.CUSTOMER},${ROLE_NAME.MOVIE_MANAGER},${ROLE_NAME.THEATER_MANAGER}]`,
    },
  )
  roleName: ROLE_NAME;
}
