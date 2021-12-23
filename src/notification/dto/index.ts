import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';
import { TutorStudentStatus } from 'src/constant';

export class UpdateNotificationDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsIn([TutorStudentStatus.ACCEPTED, TutorStudentStatus.CANCEL])
  status: string;
}
