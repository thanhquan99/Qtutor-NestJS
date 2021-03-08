import { IsOptional, IsString } from 'class-validator';

export class UpdateCinemaDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address: string;
}
