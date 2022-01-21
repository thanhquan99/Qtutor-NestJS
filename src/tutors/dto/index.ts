import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  ArrayMinSize,
  IsNumber,
} from 'class-validator';

export class ITutorSubject {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  subjectId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sessionsOfWeek: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  price: number;
}

export class CreateTutorDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsNumber()
  minimumSalary: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsNumber()
  yearsExperience: number;

  @ApiPropertyOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ITutorSubject)
  tutorSubjects: ITutorSubject[];
}

export class UpdateTutorDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  minimumSalary: number;
}

export class RegisterTeachingDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsNumber()
  salary: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  subjectId: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsNumber()
  sessionsOfWeek: number;
}
