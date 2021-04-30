import { Country } from './../movie.entity';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateMovieDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(Country)
  country: Country;

  @IsOptional()
  @IsString()
  producer: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsDateString()
  releaseDate: Date;

  @IsOptional()
  @IsNumber()
  duration: number;

  @IsOptional()
  @IsArray()
  actorIds: [number];

  @IsOptional()
  @IsArray()
  directorIds: [number];

  @IsOptional()
  @IsArray()
  genreIds: [number];
}
