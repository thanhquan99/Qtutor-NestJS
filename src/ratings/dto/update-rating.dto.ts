import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRatingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  comment: string;
}
