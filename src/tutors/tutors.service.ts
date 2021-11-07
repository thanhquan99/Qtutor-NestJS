import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { QueryBuilder } from 'objection';
import Tutor from 'src/db/models/Tutor';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class TutorsService extends BaseServiceCRUD<Tutor> {
  constructor() {
    super(Tutor, 'Tutor');
  }

  async createTutor(payload, userId): Promise<Tutor> {
    const tutor = await Tutor.query().findOne({ userId });
    if (tutor) {
      throw new BadRequestException('You were already a tutor');
    }

    return await Tutor.query().insertGraphAndFetch({ ...payload, userId });
  }
}
