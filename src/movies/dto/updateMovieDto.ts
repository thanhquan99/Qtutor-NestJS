import { ApiPropertyOptional } from '@nestjs/swagger';
import { Country } from './../movie.entity';
import {
  IsDateString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateMovieDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Country)
  country: Country;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  producer: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  trailer: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  releaseDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  duration: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  actorIds: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  directorIds: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  genreIds: string;
}
