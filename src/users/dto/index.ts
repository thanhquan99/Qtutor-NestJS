import { AcademicLevel } from './../../constant/index';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsNumberString,
  IsEnum,
} from 'class-validator';

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isMale: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  cityId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(AcademicLevel)
  academicLevel: AcademicLevel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  workLocation: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paypalEmail: string;
}

export class CreateUserDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
