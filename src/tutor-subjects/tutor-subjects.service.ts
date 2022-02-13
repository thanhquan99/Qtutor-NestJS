import { Injectable, NotFoundException } from '@nestjs/common';
import { Tutor, TutorSubject } from '../db/models';
import { CreateTutorSubjectDto, UpdateTutorSubjectDto } from './dto';

@Injectable()
export class TutorSubjectsService {
  async createOne(
    payload: CreateTutorSubjectDto,
    userId: string,
  ): Promise<TutorSubject> {
    const tutor = await Tutor.query().findOne({ userId });
    if (!tutor) {
      throw new NotFoundException('Tutor not found');
    }

    return await TutorSubject.query().insertAndFetch({
      ...payload,
      tutorId: tutor.id,
    });
  }

  async updateOne(
    id: string,
    payload: UpdateTutorSubjectDto,
    userId: string,
  ): Promise<TutorSubject> {
    const tutor = await Tutor.query().findOne({ userId });
    if (!tutor) {
      throw new NotFoundException('Tutor not found');
    }

    const tutorSubject = await TutorSubject.query().findOne({
      tutorId: tutor.id,
      id,
    });
    if (!tutorSubject) {
      throw new NotFoundException('Tutor Subject not found');
    }

    await tutorSubject.$query().patch(payload);
    return tutorSubject;
  }
}
