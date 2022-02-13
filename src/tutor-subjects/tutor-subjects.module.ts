import { Module } from '@nestjs/common';
import { TutorSubjectsController } from './tutor-subjects.controller';
import { TutorSubjectsService } from './tutor-subjects.service';

@Module({
  controllers: [TutorSubjectsController],
  providers: [TutorSubjectsService]
})
export class TutorSubjectsModule {}
