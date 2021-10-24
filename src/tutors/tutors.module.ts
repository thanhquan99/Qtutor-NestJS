import { Module } from '@nestjs/common';
import { TutorsController } from './tutors.controller';
import { TutorsService } from './tutors.service';

@Module({
  controllers: [TutorsController],
  providers: [TutorsService],
})
export class TutorsModule {}
