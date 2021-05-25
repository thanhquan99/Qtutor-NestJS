import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateGenreDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
