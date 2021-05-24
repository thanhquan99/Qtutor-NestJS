import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';

export class QueryShowtimes {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  date: Date;
}
