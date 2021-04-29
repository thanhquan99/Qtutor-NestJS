// import { Country } from './../movie.entity';
import {
  IsArray,
    IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateShowtimeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDate()
  startTime: Date;

  @IsNotEmpty()
  @IsDate()
  advertiseTime: Date;

  @IsNotEmpty()
  @IsNumber()
  duration: number;

}