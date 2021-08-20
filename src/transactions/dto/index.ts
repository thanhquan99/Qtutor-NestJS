import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class ServiceAnalysisQueryParams {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  year: number;
}
