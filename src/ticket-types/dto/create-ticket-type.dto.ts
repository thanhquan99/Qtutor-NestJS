import { IsNotEmpty, IsNumber, Min, IsString } from 'class-validator';

export class CreateTicketTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;
}