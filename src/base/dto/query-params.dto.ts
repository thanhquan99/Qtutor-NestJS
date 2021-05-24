import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class QueryParams {
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
}
