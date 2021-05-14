import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ITicket {
  @IsNotEmpty()
  @IsNumber()
  id: number;  

  @IsNotEmpty()
  @IsNumber()
  seatId: number;

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