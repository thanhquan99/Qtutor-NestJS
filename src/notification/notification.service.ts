import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { NotificationType, TutorStudentStatus } from 'src/constant';
import { Notification, Subject, TutorStudent } from 'src/db/models';
import { UpdateNotificationDto } from './dto';

@Injectable()
export class NotificationService extends BaseServiceCRUD<Notification> {
  constructor() {
    super(Notification, 'Notification');
  }

  async updateNotification(
    id: string,
    userId: string,
    payload: UpdateNotificationDto,
  ): Promise<Notification> {
    const notification = await Notification.query().findById(id);
    if (!notification || notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    if (payload.isRead) {
      await notification.$query().patch({ isRead: payload.isRead });
    }

    if (payload.status) {
      const { status } = payload;
      const tutorStudent = await TutorStudent.query()
        .modify('defaultSelect')
        .findById(notification.extraId);
      if (!tutorStudent) {
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
        }

        //Update type and read notification
        await notification.$query().patch({
          message,
          type: NotificationType.READ_ONLY,
          isRead: true,
        });
      }
    }

    return notification;
  }

  async getMyNotification(userId: string, query: any) {
    const builder = Notification.queryBuilder(query)
      .modify('defaultSelect')
      .where({ userId });
    return await this.paginate(builder, query);
  }

  async getMyNotificationSummary(userId: string): Promise<{
    total: string;
    totalUnread: string;
  }> {
    const [{ count: total }, { count: totalUnread }] = await Promise.all([
      Notification.query().where({ userId }).count().first(),
      Notification.query().where({ userId, isRead: false }).count().first(),
    ]);
    return { total, totalUnread };
  }
}
