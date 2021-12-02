import { CreateTutorDto } from './dto/index';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import Tutor from 'src/db/models/Tutor';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { knex, Student, StudentSubject, TutorSubject } from 'src/db/models';

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
    return await Tutor.query()
      .findOne({ userId })
      .withGraphFetched('[profile(defaultSelect), subjects(defaultSelect)]');
  }

  async getMany(query): Promise<{ results: Tutor[]; total }> {
    const builder = Tutor.queryBuilder(query).modify('defaultSelect');
    return await this.paginate(builder, query);
  }

  async getOne(id: string): Promise<Tutor> {
    const tutor = await Tutor.query().modify('defaultSelect').findById(id);
    if (!tutor) {
      throw new NotFoundException(`Tutor not found`);
    }

    return tutor;
  }

  async getSuggestion(
    query,
    userId: string,
  ): Promise<{ results: Tutor[]; total }> {
    const student = await Student.query().findOne({ userId });
    if (!student) {
      throw new BadRequestException(`You are not student`);
    }

    const studentSubjectBuilder = StudentSubject.query()
      .select('subjectId')
      .where({ studentId: student.id });
    const tutorSubjectBuilder = TutorSubject.query()
      .select(knex.raw('DISTINCT "tutorId"'))
      .whereRaw(
        `"subjectId" = ANY(${studentSubjectBuilder.toKnexQuery().toQuery()})`,
      );

    const builder = Tutor.queryBuilder(query)
      .modify('defaultSelect')
      .whereIn('id', knex.raw(tutorSubjectBuilder.toKnexQuery().toQuery()));
    return await this.paginate(builder, query);
  }
}
