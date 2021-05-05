import { IsDateString, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateShowtimeDto {
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(23)
  hour: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(59)
  minute: number;

  @IsNotEmpty()
  @IsNumber()
  advertiseTime: number;

  @IsNotEmpty()
  @IsNumber()
  roomId: number;

  @IsNotEmpty()
  @IsNumber()
  movieId: number;
}
