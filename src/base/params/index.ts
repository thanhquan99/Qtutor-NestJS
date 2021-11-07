import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

export class IdParam {
  @ApiProperty()
  @IsNumberString()
  id: string;
}

export class KeyParam {
  @ApiProperty()
  @IsString()
  key: string;
}
