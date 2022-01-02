import { HOURS_OF_DAY, MINUTES_OF_HOUR } from './../../constant/index';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
  IsEnum,
  IsIn,
  IsBoolean,
} from 'class-validator';
import { DaysOfWeek } from 'src/constant';

export class TimeDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsEnum(DaysOfWeek)
  dayOfWeek: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsIn(HOURS_OF_DAY)
  hour: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsIn(MINUTES_OF_HOUR)
  minute: number;
}

export class CreateScheduleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tutorStudentId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFreeTime: boolean;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => TimeDto)
  startTimeDate: TimeDto;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => TimeDto)
  endTimeDate: TimeDto;
}
