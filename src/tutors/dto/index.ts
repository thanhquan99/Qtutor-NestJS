import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';

export class ITutorSubject {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  subjectId: string;
}

export class CreateTutorDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ITutorSubject)
  tutorSubjects: ITutorSubject[];
}

export class UpdateTutorDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;
}
