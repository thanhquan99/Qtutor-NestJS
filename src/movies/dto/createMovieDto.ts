import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsString()
  producer: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  releaseDate: Date;
}
