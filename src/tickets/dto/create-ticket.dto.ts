import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsNumber()
  seatId: number;

  @IsNotEmpty()
  @IsNumber()
  showtimeId: number;

  @IsNotEmpty()
  @IsNumber()
  status: number;

  @IsNotEmpty()
  @IsNumber()
  roomId: number;

  @IsNotEmpty()
  @IsNumber()
  movieId: number;
}
