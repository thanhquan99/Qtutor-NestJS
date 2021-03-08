import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCinemaDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
