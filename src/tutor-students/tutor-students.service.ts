import { Injectable } from '@nestjs/common';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { TutorStudent } from 'src/db/models';

@Injectable()
export class TutorStudentsService extends BaseServiceCRUD<TutorStudent> {
  constructor() {
    super(TutorStudent, 'TutorStudent');
  }
}
