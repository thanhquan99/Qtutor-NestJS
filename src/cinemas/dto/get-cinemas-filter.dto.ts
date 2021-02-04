import { IsNotEmpty, IsOptional } from 'class-validator';

export class CinemasFilterDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
