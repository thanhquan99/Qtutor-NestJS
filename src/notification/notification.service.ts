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
    const notification = await Notification.query()
      .findOne({ id, userId })
      .modify('defaultSelect');
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await notification.$query().patch(payload);
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
