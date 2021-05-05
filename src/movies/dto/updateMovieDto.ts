import { Country } from './../movie.entity';
import {
  IsDateString,
  IsEnum,
  IsNumberString,
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
  @IsNumberString()
  duration: number;

  @IsOptional()
  @IsString()
  actorIds: string;

  @IsOptional()
  @IsString()
  directorIds: string;

  @IsOptional()
  @IsString()
  genreIds: string;
}
