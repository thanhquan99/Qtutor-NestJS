import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  ArrayMinSize,
  IsNumberString,
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
  @IsNumberString()
  sessionsOfWeek: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsNumberString()
  price: number;
}

export class CreateTutorDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsNumberString()
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
  @IsNumberString()
  minimumSalary: number;
}
