import {
  Body,
  Controller,
  Param,
  Patch,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { IdParam } from 'src/base/params';
import { ROLE } from 'src/constant';
import { Notification, User } from 'src/db/models';
import { Role } from 'src/guards/role.decorator';
import { UpdateNotificationDto } from './dto';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  public readonly service = new NotificationService();

  @Patch('/:id')
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  @UsePipes(ValidationPipe)
  updateOne(
    @GetUser() user: User,
    @Param() params: IdParam,
    @Body() payload: UpdateNotificationDto,
  ): Promise<Notification> {
    return this.service.updateNotification(params.id, user.id, payload);
  }
}
