import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCityDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateCityDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;
}
