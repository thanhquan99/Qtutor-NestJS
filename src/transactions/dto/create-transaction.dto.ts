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
  
  export class CreateTransactionDto {

    @IsNotEmpty()
    @IsDate()
    transactionTime: Date;

    @IsNotEmpty()
    @IsString()
    service: string;

  }