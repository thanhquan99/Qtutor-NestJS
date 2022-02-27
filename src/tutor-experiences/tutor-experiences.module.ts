import { Module } from '@nestjs/common';
import { TutorExperiencesController } from './tutor-experiences.controller';
import { TutorExperiencesService } from './tutor-experiences.service';

@Module({
  controllers: [TutorExperiencesController],
  providers: [TutorExperiencesService],
})
export class TutorExperiencesModule {}
