import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { Injectable } from '@nestjs/common';
import { Subject } from 'src/db/models';

@Injectable()
export class SubjectsService extends BaseServiceCRUD<Subject> {
  constructor() {
    super(Subject, 'Subject');
  }
}
