import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { NotificationType, TutorStudentStatus } from 'src/constant';
import { Notification, TutorStudent } from 'src/db/models';
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
    if (
      status !== TutorStudentStatus.ACCEPTED &&
      status !== TutorStudentStatus.CANCEL
    ) {
      throw new BadRequestException('Wrong status. Contact admin');
    }

    const tutorStudent = await TutorStudent.query().patchAndFetchById(
      notification.extraId,
      { status },
    );
    if (!tutorStudent) {
      throw new BadRequestException('Something went wrong. Contact admin');
    }

    let message = notification.message;
    if (status === TutorStudentStatus.ACCEPTED) {
      message += '<br/>You <b>accepted</b> this';
    }
    if (status === TutorStudentStatus.CANCEL) {
      message += '<br/>You <b>canceled</b> this';
    }

    await notification
      .$query()
      .patch({ message, type: NotificationType.READ_ONLY });
    return notification;
  }
}
