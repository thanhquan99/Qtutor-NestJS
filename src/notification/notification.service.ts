import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import {
  NotificationExtraType,
  NotificationType,
  TutorStudentStatus,
} from 'src/constant';
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

    const { status } = payload;
    const tutorStudent = await TutorStudent.query().patchAndFetchById(
      notification.extraId,
      { status },
    );
    if (!tutorStudent) {
      throw new BadRequestException('Something went wrong. Contact admin');
    }

    if (tutorStudent.status === TutorStudentStatus.WAITING_TUTOR_ACCEPT) {
      let message = notification.message;
      const subject = await Subject.query().findById(tutorStudent.subjectId);

      if (status === TutorStudentStatus.ACCEPTED) {
        message += '<br/>You <b>accepted</b> this';
        //Send notification to student
        const acceptedMessage = `Your register for <b>${subject.name}</b> course for <b>${tutorStudent.salary}</b> already <b>accepted</b>.`;
        await Notification.query().insertGraph({
          userId: notification.senderId,
          senderId: notification.userId,
          message: acceptedMessage,
          type: NotificationType.READ_ONLY,
          extraType: NotificationExtraType.TUTOR_STUDENT,
          url: `/tutors/${tutorStudent.tutorId}`,
        });
      }

      if (status === TutorStudentStatus.CANCEL) {
        message += '<br/>You <b>canceled</b> this';
        //Send notification to student
        const declinedMessage = `Your register for <b>${subject.name}</b> course for <b>${tutorStudent.salary}</b> has been <b>declined</b>.`;
        await Notification.query().insertGraph({
          userId: notification.senderId,
          senderId: notification.userId,
          message: declinedMessage,
          type: NotificationType.READ_ONLY,
          extraType: NotificationExtraType.TUTOR_STUDENT,
          url: `/tutors/${tutorStudent.tutorId}`,
        });

        //Delete tutor-student
        await tutorStudent.$query().delete();
      }

      //Update type and read notification
      await notification
        .$query()
        .patch({ message, type: NotificationType.READ_ONLY, isRead: true });
    }

    return notification;
  }
}
