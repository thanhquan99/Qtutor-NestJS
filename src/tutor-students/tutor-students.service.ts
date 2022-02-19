import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { TutorStudent, Notification } from 'src/db/models';
import { NotificationType, TutorStudentStatus } from '../constant';
import { ModelFields } from '../db/models/BaseModel';
import { UpdateTutorStudentDto } from './dto';

@Injectable()
export class TutorStudentsService extends BaseServiceCRUD<TutorStudent> {
  constructor() {
    super(TutorStudent, 'TutorStudent');
  }

  async updateTutorStudent(
    id: string,
    userId: string,
    payload: UpdateTutorStudentDto,
  ): Promise<ModelFields<TutorStudent>> {
    const { status } = payload;
    const tutorStudent = await TutorStudent.query()
      .modify('defaultSelect')
      .findById(id);
    if (!tutorStudent) {
      throw new BadRequestException('Data not found');
    }

    const notification = await Notification.query()
      .findOne({
        extraId: tutorStudent.id,
      })
      .modify('defaultSelect');
    if (!notification) {
      throw new BadRequestException('Something went wrong. Contact admin');
    }

    if (
      tutorStudent.status === TutorStudentStatus.WAITING_TUTOR_ACCEPT &&
      tutorStudent.tutor.userId === userId
    ) {
      let message = notification.message;

      if (status === TutorStudentStatus.ACCEPTED) {
        message += '<br/>You <b>accepted</b> this';
        //Send notification to student
        const acceptedMessage = `Your registration for studying <b>${tutorStudent.subject.name}</b> course for <b>${tutorStudent.salary}</b> <b>${tutorStudent.sessionsOfWeek} lessons/week</b> already <b>accepted</b>.`;
        await Notification.query().insertGraph({
          userId: notification.senderId,
          senderId: notification.userId,
          message: acceptedMessage,
          type: NotificationType.READ_ONLY,
          url: `/tutors/${tutorStudent.tutorId}`,
        });

        await tutorStudent.$query().patch({ status });
      }

      if (status === TutorStudentStatus.CANCEL) {
        message += '<br/>You <b>canceled</b> this';
        //Send notification to student
        const declinedMessage = `Your registration for studying <b>${tutorStudent.subject.name}</b> course for <b>${tutorStudent.salary}</b> <b>${tutorStudent.sessionsOfWeek} lessons/week</b> has been <b>declined</b>.`;
        await Notification.query().insertGraph({
          userId: notification.senderId,
          senderId: notification.userId,
          message: declinedMessage,
          type: NotificationType.READ_ONLY,
          url: `/tutors/${tutorStudent.tutorId}`,
        });

        //Delete tutor-student
        await tutorStudent.$query().delete();
        return { notification };
      }

      //Update type and read notification
      await notification.$query().patch({
        message,
        type: NotificationType.READ_ONLY,
        isRead: true,
      });
    }

    if (
      tutorStudent.status === TutorStudentStatus.WAITING_STUDENT_ACCEPT &&
      tutorStudent.student.userId === userId
    ) {
      let message = notification.message;

      if (status === TutorStudentStatus.ACCEPTED) {
        message += '<br/>You <b>accepted</b> this';
        //Send notification to student
        const acceptedMessage = `Your registration for teaching <b>${tutorStudent.subject.name}</b> course for <b>${tutorStudent.salary}</b> <b>${tutorStudent.sessionsOfWeek} lessons/week</b> already <b>accepted</b>.`;
        await Notification.query().insertGraph({
          userId: notification.senderId,
          senderId: notification.userId,
          message: acceptedMessage,
          type: NotificationType.READ_ONLY,
          url: `/students/${tutorStudent.studentId}`,
        });

        await tutorStudent.$query().patch({ status });
      }

      if (status === TutorStudentStatus.CANCEL) {
        message += '<br/>You <b>canceled</b> this';
        //Send notification to student
        const declinedMessage = `Your registration for teaching <b>${tutorStudent.subject.name}</b> course for <b>${tutorStudent.salary}</b> <b>${tutorStudent.sessionsOfWeek} lessons/week</b> has been <b>declined</b>.`;
        await Notification.query().insertGraph({
          userId: notification.senderId,
          senderId: notification.userId,
          message: declinedMessage,
          type: NotificationType.READ_ONLY,
          url: `/students/${tutorStudent.studentId}`,
        });

        //Delete tutor-student
        await tutorStudent.$query().delete();
        return { notification };
      }

      //Update type and read notification
      await notification.$query().patch({
        message,
        type: NotificationType.READ_ONLY,
        isRead: true,
      });
    }

    return { ...tutorStudent, notification };
  }
}
