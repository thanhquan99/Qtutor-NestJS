import { IsNumber, IsOptional, IsString } from 'class-validator';
export class UpdateSeatDto {
  @IsOptional()
  @IsString()
  row: string;

  @IsOptional()
  @IsNumber()
  column: number;

  @IsOptional()
  @IsString()
  type: string;
}
