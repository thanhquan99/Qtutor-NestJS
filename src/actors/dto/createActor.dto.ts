import { IsNotEmpty, IsString } from 'class-validator';

export class CreateActorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
