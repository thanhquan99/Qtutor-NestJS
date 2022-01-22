import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import {
  knex,
  Notification,
  Profile,
  Schedule,
  Student,
  StudentSubject,
  Subject,
  TutorStudent,
  TutorSubject,
} from 'src/db/models';
import Tutor from 'src/db/models/Tutor';
import {
  DEFAULT_EMAIL,
  DEFAULT_WEB_CLIENT_URL,
  NotificationExtraType,
  NotificationType,
  TutorStudentStatus,
} from './../constant/index';
import { CreateTutorDto, RegisterTeachingDto } from './dto/index';
import { customFilterInTutors } from './utils';

@Injectable()
export class TutorsService extends BaseServiceCRUD<Tutor> {
  constructor(public readonly mailService: MailerService) {
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

  async getTutor(id: string, userId: string): Promise<Tutor> {
    const tutor = await Tutor.query().modify('selectInGetOne').findById(id);
    if (!tutor) {
      throw new NotFoundException(`Tutor not found`);
    }

    const aboutClient = { isStudentOfTutor: false };
    if (userId) {
      const student = await Student.query().findOne({ userId });
      if (student) {
        const tutorStudent = await TutorStudent.query()
          .where({
            tutorId: tutor.id,
            studentId: student.id,
          })
          .whereIn('status', [
            TutorStudentStatus.ACCEPTED,
            TutorStudentStatus.ARCHIVED,
          ])
          .limit(1);
        if (tutorStudent?.length) {
          aboutClient.isStudentOfTutor = true;
        }
      }
    }

    tutor.aboutClient = aboutClient;
    return tutor;
  }

  async getSuggestion(
    query,
    userId: string,
  ): Promise<{ results: Tutor[]; total }> {
    const student = await Student.query()
      .modify('defaultSelect')
      .findOne({ userId });
    if (!student) {
      throw new BadRequestException(`You are not student`);
    }

    const tutorSubjectBuilder = TutorSubject.query()
      .select(knex.raw('DISTINCT "tutorId"'))
      .whereIn(
        'subjectId',
        student.subjects.map((e) => e.id),
      );
    const profileBuilder = Profile.query().select('userId').where({
      cityId: student.profile.cityId,
    });

    const builder = Tutor.queryBuilder(query)
      .modify('selectInSuggestion')
      .whereIn('id', knex.raw(tutorSubjectBuilder.toKnexQuery().toQuery()))
      .whereIn('userId', profileBuilder)
      .andWhere('userId', '!=', userId);

    const freeTimeSchedules = await Schedule.query().where({
      userId: student.userId,
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

  async registerTeaching(
    payload: RegisterTeachingDto,
    student: Student,
    tutor: Tutor,
  ): Promise<TutorStudent> {
    const existTutorStudent = await TutorStudent.query().findOne({
      studentId: student.id,
      tutorId: tutor.id,
      subjectId: payload.subjectId,
    });
    if (existTutorStudent) {
      throw new BadRequestException('You already register this subject');
    }

    const tutorStudent = await TutorStudent.query().insertGraphAndFetch({
      ...payload,
      tutorId: tutor.id,
      status: TutorStudentStatus.WAITING_STUDENT_ACCEPT,
    });

    const profile = await Profile.query().findOne({ userId: tutor.userId });
    const subject = await Subject.query().findById(payload.subjectId);
    const sendNotificationFunc = Notification.query().insertGraphAndFetch({
      message: `<b>${profile.name}</b> want to teach <b>${
        subject.name
      }</b> course for <b>${new Intl.NumberFormat().format(
        payload.salary,
      )}</b> with <b>${payload.sessionsOfWeek}</b> lessons/week.`,
      type: NotificationType.EDIT,
      url: `tutors/${tutor.id}`,
      userId: student.userId,
      senderId: tutor.userId,
      extraId: tutorStudent.id,
      extraType: NotificationExtraType.TUTOR_STUDENT,
    });

    const sendMailFunc = this.mailService.sendMail({
      to: DEFAULT_EMAIL, // list of receivers
      subject: 'A TUTOR WANT TO TEACH YOU', // Subject line
      html: `<b>${profile.name}</b> want to teach <b>${
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
}
