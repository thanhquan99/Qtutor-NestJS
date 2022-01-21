import { TutorStudentsService } from './../tutor-students/tutor-students.service';
import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService, TutorStudentsService],
  imports: [],
})
export class StudentsModule {}
