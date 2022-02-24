import { Module } from '@nestjs/common';
import { StudentSubjectsController } from './student-subjects.controller';
import { StudentSubjectsService } from './student-subjects.service';

@Module({
  controllers: [StudentSubjectsController],
  providers: [StudentSubjectsService],
})
export class StudentSubjectsModule {}
