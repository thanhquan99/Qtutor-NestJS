import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  ArrayMinSize,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { TutorStudentStatus } from 'src/constant';

export class IStudentSubject {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  subjectId: string;
}

export class CreateStudentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => IStudentSubject)
  studentSubjects: IStudentSubject[];
}

export class UpdateStudentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;
}

export class RegisterStudyDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsNumber()
  salary: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  tutorId: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  subjectId: string;
}
