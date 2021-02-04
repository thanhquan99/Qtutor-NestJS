import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCinemaDto {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  city: string;
}
