import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateGenreDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;
}
