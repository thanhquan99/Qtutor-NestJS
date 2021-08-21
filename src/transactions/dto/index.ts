import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumberString,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class AnalysisQueryParams {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate: Date;
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate: Date;
}
