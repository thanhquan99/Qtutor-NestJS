import { IsNotEmpty } from 'class-validator';

export class CreateCinemaDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  city: string;
}
