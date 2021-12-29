import { Controller } from '@nestjs/common';
import { TutorStudentsService } from './tutor-students.service';

@Controller('tutor-students')
export class TutorStudentsController {
  public readonly service = new TutorStudentsService();
}
