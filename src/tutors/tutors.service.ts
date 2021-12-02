import { CreateTutorDto } from './dto/index';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import Tutor from 'src/db/models/Tutor';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

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
}
