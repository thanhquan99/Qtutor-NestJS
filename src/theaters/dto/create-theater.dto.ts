import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTheaterDto {
  @IsNotEmpty()
  @IsNumber()
  theaterNumber: number;
}
