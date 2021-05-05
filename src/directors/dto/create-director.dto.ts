import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDirectorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
