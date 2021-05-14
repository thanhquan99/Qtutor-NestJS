import { IsNotEmpty, IsNumber, Min, IsString } from 'class-validator';

export class ITicket {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateTicketDto {
  tickets : [ITicket];
}