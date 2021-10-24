import Tutor from 'src/db/models/Tutor';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TutorsService {
  async getMany() {
    return await Tutor.query();
  }
}
