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
  transaction_time: Date;

  @IsNotEmpty()
  @IsString()
  service: string;

  @IsNotEmpty()
  @IsNumber()
  ticketId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
