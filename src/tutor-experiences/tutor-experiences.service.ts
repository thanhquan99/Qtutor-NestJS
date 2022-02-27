import { CreateTutorExperienceDto } from './dto/index';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Tutor, TutorExperience } from '../db/models';

@Injectable()
export class TutorExperiencesService {
  async createOne(
    payload: CreateTutorExperienceDto,
    userId: string,
  ): Promise<TutorExperience> {
    const tutor = await Tutor.query().findOne({ userId });
    if (!tutor) {
      throw new NotFoundException('Tutor not found');
    }

    return await TutorExperience.query().insertAndFetch({
      ...payload,
      tutorId: tutor.id,
    });
  }

  async deleteOne(id: string, userId: string): Promise<{ message: string }> {
    const tutor = await Tutor.query().findOne({ userId });
    if (!tutor) {
      throw new NotFoundException('Tutor not found');
    }

    await TutorExperience.query().where({ id, tutorId: tutor.id }).delete();
    return { message: 'Delete successfully' };
  }
}
