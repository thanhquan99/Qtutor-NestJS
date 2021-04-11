import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateRolePermissionDto {
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @IsNotEmpty()
  @IsNumber()
  permissionId: number;
}
