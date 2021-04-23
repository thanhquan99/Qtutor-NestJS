import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSeatDto {
  @IsNotEmpty()
  @IsString()
  row: string;

  @IsNotEmpty()
  @IsNumber()
  column: number;

  @IsNotEmpty()
  @IsString()
  type: string;
}
