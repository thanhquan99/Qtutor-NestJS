import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TutorStudentStatus } from 'src/constant';

export class UpdateNotificationDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsEnum(TutorStudentStatus)
  status: string;
}
