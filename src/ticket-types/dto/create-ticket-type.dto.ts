import { IsNotEmpty, IsNumber, Min, IsString } from 'class-validator';
import { Seat } from 'src/seats/seat.entity';

export class ITicket {
  @IsNotEmpty()
  @IsNumber()
  seatId: number;

  @IsNotEmpty()
  @IsNumber()
  movieShowtimeId: number;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsNumber()
  typeId: number;
}

export class CreateTicketDto {
  tickets : [ITicket];
}