import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateStudentSubjectDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sessionsOfWeek: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  price: number;
}

export class CreateStudentSubjectDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  subjectId: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsNumber()
  sessionsOfWeek: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
