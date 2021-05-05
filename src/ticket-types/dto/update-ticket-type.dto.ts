import { IsNumber, Min, IsString, IsOptional } from 'class-validator';

export class UpdateTicketTypeDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price: number;
}
