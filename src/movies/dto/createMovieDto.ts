import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Country } from './../movie.entity';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Country, {
    message: `Country should be in [${Country.AM},${Country.VN}]`,
  })
  country: Country;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  producer: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  trailer: string;  

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  releaseDate: Date;

  @ApiProperty()
  @IsNotEmpty()
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
