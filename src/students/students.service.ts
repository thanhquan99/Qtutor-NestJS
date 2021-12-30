import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import {
  NotificationExtraType,
  NotificationType,
  TutorStudentStatus,
} from 'src/constant';
import {
  Notification,
  Profile,
  Student,
  Subject,
  Tutor,
  TutorStudent,
} from 'src/db/models';
import { CreateStudentDto, RegisterStudyDto } from './dto/index';
import { customFilterInStudents } from './utils';

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

  async getOne(id: string): Promise<Student> {
    return await Student.query().findById(id).modify('defaultSelect');
  }

  async registerStudy(
    payload: RegisterStudyDto,
    student: Student,
    tutor: Tutor,
  ): Promise<TutorStudent> {
    const existTutorStudent = await TutorStudent.query().findOne({
      studentId: student.id,
      tutorId: tutor.id,
      subjectId: payload.subjectId,
    });
    if (existTutorStudent) {
      throw new BadRequestException('You already register this course');
    }

    const tutorStudent = await TutorStudent.query().insertGraphAndFetch({
      ...payload,
      studentId: student.id,
      status: TutorStudentStatus.WAITING_TUTOR_ACCEPT,
    });

    const profile = await Profile.query().findOne({ userId: student.userId });
    const subject = await Subject.query().findById(payload.subjectId);
    await Notification.query().insertGraphAndFetch({
      message: `<b>${profile.name}</b> want to register for <b>${
        subject.name
      }</b> course for <b>${new Intl.NumberFormat().format(
        payload.salary,
      )}</b>.`,
      type: NotificationType.EDIT,
      url: `students/${student.id}`,
      userId: tutor.userId,
      senderId: student.userId,
      extraId: tutorStudent.id,
      extraType: NotificationExtraType.TUTOR_STUDENT,
    });

    return tutorStudent;
  }

  async getStudents(
    query,
    userId: string,
  ): Promise<{ results: Student[]; total }> {
    const builder =
      Student.queryBuilder<Student>(query).modify('defaultSelect');
    if (userId) {
      builder.andWhere('userId', '!=', userId);
    }
    customFilterInStudents(builder, query.customFilter);
    return await this.paginate(builder, query);
  }

  async getMyCourses(
    userId: string,
    query: any,
  ): Promise<{ results: TutorStudent[]; total }> {
    const student = await Student.query().findOne({ userId });
    if (!student) {
      throw new BadRequestException('You are not student');
    }

    const builder = TutorStudent.query()
      .modify('selectInGetCourse')
      .where({ studentId: student.id })
      .whereIn('status', [
        TutorStudentStatus.ACCEPTED,
        TutorStudentStatus.ARCHIVED,
      ]);

    return await this.paginate(builder, query);
  }
}
