import { CreateStudentDto } from './dto/index';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Student } from 'src/db/models';

@Injectable()
export class StudentsService extends BaseServiceCRUD<Student> {
  constructor() {
    super(Student, 'Student');
  }

  async createStudent(payload: CreateStudentDto, userId): Promise<Student> {
    const student = await Student.query().findOne({ userId });
    if (student) {
      throw new BadRequestException('You are already a student');
    }

    return await Student.query().insertGraphAndFetch({ ...payload, userId });
  }

  async getMe(userId: string): Promise<Student> {
    return await Student.query()
      .findOne({ userId })
      .withGraphFetched('[profile(defaultSelect), subjects(defaultSelect)]');
  }
}
