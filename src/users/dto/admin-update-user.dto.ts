import { ApiPropertyOptional } from '@nestjs/swagger';
import { ROLE_NAME } from './../../roles/role.entity';
import { IsEnum } from 'class-validator';
import { IsOptional, IsBoolean } from 'class-validator';

export class AdminUpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

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
