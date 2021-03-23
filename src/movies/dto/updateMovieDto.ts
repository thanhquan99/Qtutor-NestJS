import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateMovieDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  producer: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsDateString()
  releaseDate: Date;
}
