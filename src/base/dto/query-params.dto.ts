import { IsArray, IsNumberString, IsOptional, IsString } from 'class-validator';

export class QueryParams {
  @IsOptional()
  @IsString()
  orderBy: string;

  @IsOptional()
  @IsString()
  filter: string;

  @IsOptional()
  @IsNumberString()
  page: number;

  @IsOptional()
  @IsNumberString()
  perPage: number;

  @IsOptional()
  @IsString()
  relations: string;
}
