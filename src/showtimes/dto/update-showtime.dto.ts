import { IsDate, IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateShowtimeDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsDate()
  startTime: Date;

  @IsOptional()
  @IsNumber()
  advertiseTime: number;
}
