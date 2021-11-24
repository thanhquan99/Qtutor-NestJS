import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubjectDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateSubjectDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;
}
