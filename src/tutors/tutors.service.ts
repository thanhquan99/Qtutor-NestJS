import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { QueryBuilder } from 'objection';
import { QueryParams } from 'src/base/dto/query-params.dto';
import Tutor from 'src/db/models/Tutor';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TutorsService extends BaseServiceCRUD<Tutor> {
  constructor() {
    super(Tutor, 'Tutor');
  }

  async createTutor(payload, userId): Promise<Tutor> {
    return await Tutor.query().insertGraphAndFetch({ ...payload, userId });
  }
}
