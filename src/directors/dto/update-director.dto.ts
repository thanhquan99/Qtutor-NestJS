import { IsString, IsOptional } from 'class-validator';

export class UpdateDirectorDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}
