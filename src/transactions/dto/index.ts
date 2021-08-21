import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class ServiceAnalysisQueryParams {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  year: number;
}

export class TransactionQueryParams {
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
  @IsNumberString()
  cinemaId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  movieId: number;
}
