import { IsNumberString, IsOptional } from 'class-validator';

export class UpdateRoomDto {
  @IsOptional()
  @IsNumberString()
  roomNumber: number;
}
