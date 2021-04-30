import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateShowtimeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDate()
  startTime: Date;

  @IsNotEmpty()
  @IsNumber()
  advertiseTime: number;

  @IsNotEmpty()
  @IsNumber()
  roomId: number;

  @IsNotEmpty()
  @IsDate()
  date: Date;
}
