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

    return await TutorSubject.query()
      .insertAndFetch({
        ...payload,
        tutorId: tutor.id,
      })
      .modify('defaultSelect');
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

    const tutorSubject = await TutorSubject.query()
      .findOne({
        tutorId: tutor.id,
        id,
      })
      .modify('defaultSelect');
    if (!tutorSubject) {
      throw new NotFoundException('Tutor Subject not found');
    }

    await tutorSubject.$query().patch(payload);
    return tutorSubject;
  }

  async deleteOne(id: string, userId: string): Promise<{ message: string }> {
    const tutor = await Tutor.query().findOne({ userId });
    if (!tutor) {
      throw new NotFoundException('Tutor not found');
    }

    await TutorSubject.query().where({ id, tutorId: tutor.id }).delete();
    return { message: 'Delete successfully' };
  }
}
