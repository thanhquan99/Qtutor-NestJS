import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class QueryParams {
  @IsOptional()
  @IsNumberString()
  limit: number;

  @IsOptional()
  @IsNumberString()
  offset: number;

  @IsOptional()
  @IsString()
  orderBy: string;

  @IsOptional()
  @IsString()
  filter: string;
}
