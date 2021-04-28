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
  
  export class CreateRatingDto {
    @IsNotEmpty()
    @IsString()
    comment: string;
  }