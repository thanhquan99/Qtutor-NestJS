import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(1)
  row: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  column: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  columns: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(SeatType, {
    message: `Type should be in [${SeatType.NORMAL},${SeatType.VIP}, ${SeatType.COUPLE}]`,
  })
  type: SeatType;
}
