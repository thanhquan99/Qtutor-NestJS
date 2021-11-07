import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateTutorDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;
}

export class UpdateTutorDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;
}
