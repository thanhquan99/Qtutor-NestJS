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
}

export class ITeachingPrice {
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
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ITutorSubject)
  tutorSubjects: ITutorSubject[];

  @ApiPropertyOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ITeachingPrice)
  teachingPrices: ITeachingPrice[];
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
