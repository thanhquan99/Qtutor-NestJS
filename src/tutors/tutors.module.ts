import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { TutorsController } from './tutors.controller';
import { TutorsService } from './tutors.service';

@Module({
  imports: [AuthModule],
  controllers: [TutorsController],
  providers: [TutorsService],
})
export class TutorsModule {}
