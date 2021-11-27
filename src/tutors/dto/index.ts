import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  ArrayMinSize,
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
  @IsString()
  description: string;

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
}
