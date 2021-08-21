import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ShowtimeQueryParams {
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
