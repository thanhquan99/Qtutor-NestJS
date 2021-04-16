import { Country } from './../movie.entity';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(Country, {
    message: `Country should be in [${Country.AM},${Country.VN}]`,
  })
  country: Country;

  @IsNotEmpty()
  @IsString()
  producer: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  releaseDate: Date;

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
