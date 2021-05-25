import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateShowtimeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  startTime: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  advertiseTime: number;
}
