import { IsOptional, IsDateString } from 'class-validator';

export class QueryShowtimes {
  @IsOptional()
  @IsDateString()
  date: Date;
}
