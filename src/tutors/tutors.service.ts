import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import {
  knex,
  Profile,
  Schedule,
  Student,
  StudentSubject,
  TutorStudent,
} from 'src/db/models';
import Tutor from 'src/db/models/Tutor';
import { TutorStudentStatus } from './../constant/index';
import { CreateTutorDto } from './dto/index';
import { customFilterInTutors } from './utils';

@Injectable()
export class TutorsService extends BaseServiceCRUD<Tutor> {
  constructor() {
    super(Tutor, 'Tutor');
  }

  async createTutor(payload: CreateTutorDto, userId): Promise<Tutor> {
    const tutor = await Tutor.query().findOne({ userId });
    if (tutor) {
      throw new BadRequestException('You are already a tutor');
    }

    return await Tutor.query().insertGraphAndFetch({ ...payload, userId });
  }

  async getMe(userId: string): Promise<Tutor> {
    return await Tutor.query().findOne({ userId }).modify('selectInGetOne');
  }

  async getTutors(query, userId: string): Promise<{ results: Tutor[]; total }> {
    const builder = Tutor.queryBuilder<Tutor>(query).modify('defaultSelect');
    if (userId) {
      builder.andWhere('userId', '!=', userId);
    }
    customFilterInTutors(builder, query.customFilter);
    return await this.paginate(builder, query);
  }

  async getOne(id: string): Promise<Tutor> {
    const tutor = await Tutor.query().modify('selectInGetOne').findById(id);
    if (!tutor) {
      throw new NotFoundException(`Tutor not found`);
    }

    return tutor;
  }

  async getSuggestion(
    query,
    userId: string,
  ): Promise<{ results: Student[]; total }> {
    const tutor = await Tutor.query()
      .modify('defaultSelect')
      .findOne({ userId });
    if (!tutor) {
      throw new BadRequestException(`You are not student`);
    }

    const studentSubjectBuilder = StudentSubject.query()
      .select(knex.raw('DISTINCT "studentId"'))
      .whereIn(
        'subjectId',
        tutor.subjects.map((e) => e.id),
      );
    const profileBuilder = Profile.query().select('userId').where({
      cityId: tutor.profile.cityId,
    });

    const builder = Student.queryBuilder(query)
      .modify('selectInTutorStudent')
      .whereIn('id', knex.raw(studentSubjectBuilder.toKnexQuery().toQuery()))
      .whereIn('userId', profileBuilder)
      .andWhere('userId', '!=', userId);

    const freeTimeSchedules = await Schedule.query().where({
      userId: tutor.userId,
      isFreeTime: true,
    });
    if (freeTimeSchedules?.length) {
      const invalidScheduleBuilder = Schedule.query()
        .select(knex.raw('DISTINCT "userId"'))
        .where({
          isFreeTime: false,
        });

      freeTimeSchedules.forEach((e) => {
        invalidScheduleBuilder.andWhereRaw(
          `(?, ?) OVERLAPS ("startTime", "endTime")`,
          [e.startTime.toISOString(), e.endTime.toISOString()],
        );
      });

      builder.whereNotIn('userId', invalidScheduleBuilder);
    }

    return await this.paginate(builder, query);
  }

  async getMyTeachings(
    query: any,
    userId: string,
  ): Promise<{ results: TutorStudent[]; total: number }> {
    const tutor = await Tutor.query().findOne({ userId });
    if (!tutor) {
      throw new BadRequestException('You are not tutor');
    }

    const tutorStudentBuilder = TutorStudent.query()
      .modify('selectInGetTeaching')
      .where({ tutorId: tutor.id })
      .whereIn('status', [
        TutorStudentStatus.ACCEPTED,
        TutorStudentStatus.ARCHIVED,
      ]);

    return await this.paginate(tutorStudentBuilder, query);
  }
}
