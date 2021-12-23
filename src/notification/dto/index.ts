import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional } from 'class-validator';
import { TutorStudentStatus } from 'src/constant';

export class UpdateNotificationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsIn([TutorStudentStatus.ACCEPTED, TutorStudentStatus.CANCEL])
  status: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isRead: boolean;
}
