import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateShowtimeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(23)
  hour: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(59)
  minute: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  advertiseTime: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  roomId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  movieId: number;
}
