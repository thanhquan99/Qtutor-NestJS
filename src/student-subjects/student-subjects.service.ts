import { Injectable, NotFoundException } from '@nestjs/common';
import { Student, StudentSubject } from '../db/models';
import { CreateStudentSubjectDto, UpdateStudentSubjectDto } from './dto';

@Injectable()
export class StudentSubjectsService {
  async createOne(
    payload: CreateStudentSubjectDto,
    userId: string,
  ): Promise<StudentSubject> {
    const student = await Student.query().findOne({ userId });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return await StudentSubject.query()
      .insertAndFetch({
        ...payload,
        studentId: student.id,
      })
      .modify('defaultSelect');
  }

  async updateOne(
    id: string,
    payload: UpdateStudentSubjectDto,
    userId: string,
  ): Promise<StudentSubject> {
    const student = await Student.query().findOne({ userId });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const studentSubject = await StudentSubject.query()
      .findOne({
        studentId: student.id,
        id,
      })
      .modify('defaultSelect');
    if (!studentSubject) {
      throw new NotFoundException('Student Subject not found');
    }

    await studentSubject.$query().patch(payload);
    return studentSubject;
  }
}
