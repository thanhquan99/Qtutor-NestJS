import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateMeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateOfBirth: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatar: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  additionalInformation: string;
}
