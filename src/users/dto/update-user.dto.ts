import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsNumber,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsOptional()
  @IsNumber()
  age: number;
}
