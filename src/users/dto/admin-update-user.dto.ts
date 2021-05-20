import { ROLE_NAME } from './../../roles/role.entity';
import { IsEnum } from 'class-validator';
import { IsOptional, IsBoolean } from 'class-validator';

export class AdminUpdateUserDto {
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsEnum(
    [ROLE_NAME.CUSTOMER, ROLE_NAME.MOVIE_MANAGER, ROLE_NAME.THEATER_MANAGER],
    {
      message: `Country should be in [${ROLE_NAME.CUSTOMER},${ROLE_NAME.MOVIE_MANAGER},${ROLE_NAME.THEATER_MANAGER}]`,
    },
  )
  roleName: boolean;
}
