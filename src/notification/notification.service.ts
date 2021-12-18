import { Injectable } from '@nestjs/common';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { Notification } from 'src/db/models';

@Injectable()
export class NotificationService extends BaseServiceCRUD<Notification> {
  constructor() {
    super(Notification, 'Notification');
  }
}
