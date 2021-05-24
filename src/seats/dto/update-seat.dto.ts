import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
export class UpdateSeatDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  row: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  column: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type: string;
}
