import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTutorExperienceDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  description: string;
}
