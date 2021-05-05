import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsNumberString()
  roomNumber: number;
}
