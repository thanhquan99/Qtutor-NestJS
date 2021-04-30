import { SeatType } from './../seat.entity';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
  MaxLength,
} from 'class-validator';

export class CreateSeatDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(1)
  row: string;

  @IsOptional()
  @IsNumber()
  column: number;

  @IsOptional()
  @IsNumber()
  columns: number;

  @IsNotEmpty()
  @IsEnum(SeatType, {
    message: `Type should be in [${SeatType.NORMAL},${SeatType.VIP}, ${SeatType.COUPLE}]`,
  })
  type: SeatType;
}
