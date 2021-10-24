import { TutorsService } from './tutors.service';
import { Controller, Get } from '@nestjs/common';
import Tutor from 'src/db/models/Tutor';

@Controller('tutors')
export class TutorsController {
  public readonly service = new TutorsService();

  @Get()
  getMany(): Promise<Tutor[]> {
    return this.service.getMany();
  }
}
