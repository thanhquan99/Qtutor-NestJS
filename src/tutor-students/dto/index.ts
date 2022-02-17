import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { TutorStudentStatus } from 'src/constant';

export class UpdateTutorStudentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsIn([TutorStudentStatus.ACCEPTED, TutorStudentStatus.CANCEL])
  status: string;
}
