import {
  DEFAULT_EMAIL,
  DEFAULT_WEB_CLIENT_URL,
  TransactionStatus,
} from './../constant/index';
import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import {
  NotificationExtraType,
  NotificationType,
  TutorStudentStatus,
} from 'src/constant';
import {
  knex,
  Notification,
  Profile,
  Schedule,
  Student,
  StudentSubject,
  Subject,
  Tutor,
  TutorStudent,
  Transaction,
} from 'src/db/models';
import { CreateStudentDto, RegisterStudyDto } from './dto/index';
import { customFilterInStudents } from './utils';
import { ModelFields } from '../db/models/BaseModel';

@Injectable()
export class StudentsService extends BaseServiceCRUD<Student> {
  constructor(private readonly mailerService: MailerService) {
    super(Student, 'Student');
  }

  async createStudent(payload: ModelFields<Student>, userId): Promise<Student> {
    const student = await Student.query().findOne({ userId });
    if (student) {
      throw new BadRequestException('You are already a student');
    }

    return await Student.query().insertGraphAndFetch({ ...payload, userId });
  }

  async getMe(userId: string): Promise<Student> {
    return await Student.query()
      .findOne({ userId })
      .withGraphFetched(
        '[profile(defaultSelect), studentSubjects(defaultSelect), learnings(distinctSubject)]',
      );
  }

  async getOne(id: string): Promise<Student> {
    const student = await Student.query().findById(id).modify('selectInGetOne');
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
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
    const sendNotificationFunc = Notification.query().insertGraphAndFetch({
      message: `<b>${profile.name}</b> want to register for <b>${
        subject.name
      }</b> course for <b>${new Intl.NumberFormat().format(
        payload.salary,
      )}</b> with <b>${payload.sessionsOfWeek}</b> lessons/week.`,
      type: NotificationType.EDIT,
      url: `students/${student.id}`,
      userId: tutor.userId,
      senderId: student.userId,
      extraId: tutorStudent.id,
      extraType: NotificationExtraType.TUTOR_STUDENT,
    });
    const sendMailFunc = this.mailerService.sendMail({
      to: DEFAULT_EMAIL, // list of receivers
      subject: 'A STUDENT REGISTER YOUR COURSE', // Subject line
      html: `<b>${profile.name}</b> want to register for <b>${
        subject.name
      }</b> course for <b>${new Intl.NumberFormat().format(
        payload.salary,
      )}</b> with <b>${payload.sessionsOfWeek}</b> lessons/week.
      <br/>
      Go to <a href="${DEFAULT_WEB_CLIENT_URL}">QTutor</a> to check it
      `, // HTML body content
    });
    await Promise.all([sendNotificationFunc, sendMailFunc]);

    return tutorStudent;
  }

  async getStudents(
    query,
    userId: string,
  ): Promise<{ results: Student[]; total }> {
    const builder = Student.queryBuilder<Student>(query)
      .andWhere({ isActive: true })
      .modify('defaultSelect');
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
      .where({ studentId: student.id });

    return await this.paginate(builder, query);
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
      .andWhere({ isActive: true })
      .andWhere('userId', '!=', userId);

    const freeTimeSchedules = await Schedule.query().where({
      userId: tutor.userId,
      isFreeTime: true,
    });
    if (freeTimeSchedules?.length) {
      const validScheduleBuilder = Schedule.query()
        .select(knex.raw('DISTINCT "userId"'))
        .where({
          isFreeTime: true,
        });

      freeTimeSchedules.forEach((e) => {
        validScheduleBuilder.andWhereRaw(
          `(?, ?) OVERLAPS ("startTime", "endTime")`,
          [e.startTime.toISOString(), e.endTime.toISOString()],
        );
      });

      builder.whereIn('userId', validScheduleBuilder);
    }

    return await this.paginate(builder, query);
  }

  async getDetailLearnings(
    tutorStudentId: string,
    userId: string,
  ): Promise<{
    totalLessons: string;
    totalMoney: string;
    schedules: Schedule[];
    totalPaid: string;
    totalUnpaid: string;
  }> {
    const tutorStudent = await TutorStudent.query().findById(tutorStudentId);
    if (!tutorStudent) {
      throw new NotFoundException('Teaching not found');
    }
    const tutor = await Tutor.query().findById(tutorStudent.tutorId);

    const [
      { count: totalLessons },
      { sum: totalMoney },
      { sum: totalPaid },
      { sum: totalUnpaid },
      schedules,
    ] = await Promise.all([
      Transaction.query()
        .where({
          tutorUserId: tutor.userId,
          studentUserId: userId,
          subjectId: tutorStudent.subjectId,
        })
        .count()
        .first(),
      Transaction.query()
        .select(knex.raw('COALESCE(SUM(price), 0) as "sum"'))
        .where({
          tutorUserId: tutor.userId,
          studentUserId: userId,
          subjectId: tutorStudent.subjectId,
        })
        .first(),
      Transaction.query()
        .select(knex.raw('COALESCE(SUM(price), 0) as "sum"'))
        .where({
          tutorUserId: tutor.userId,
          studentUserId: userId,
          subjectId: tutorStudent.subjectId,
          status: TransactionStatus.PAID,
        })
        .first(),
      Transaction.query()
        .select(knex.raw('COALESCE(SUM(price), 0) as "sum"'))
        .where({
          tutorUserId: tutor.userId,
          studentUserId: userId,
          subjectId: tutorStudent.subjectId,
          status: TransactionStatus.UNPAID,
        })
        .first(),
      Schedule.query().where({ userId, tutorStudentId }),
    ]);

    return {
      totalLessons,
      totalMoney,
      totalPaid,
      totalUnpaid,
      schedules: schedules,
    };
  }
}
