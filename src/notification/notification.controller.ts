import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { QueryParams } from 'src/base/dto/query-params.dto';
import { IdParam } from 'src/base/params';
import { ROLE } from 'src/constant';
import { Notification, User } from 'src/db/models';
import { Role } from 'src/guards/role.decorator';
import { UpdateNotificationDto } from './dto';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  public readonly service = new NotificationService();

  @Get('/me')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  getMyNotification(@GetUser() user: User, @Query() query: QueryParams) {
    if (query.filter) {
      query.filter = JSON.parse(query.filter);
    }
    if (query.orderBy) {
      query.orderBy = JSON.parse(query.orderBy);
    }
    query.page = query.page || 1;
    query.perPage = query.perPage || 10;
    return this.service.getMyNotification(user.id, query);
  }

  @Get('/me/summary')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  getMyNotificationSummary(
    @GetUser() user: User,
  ): Promise<{ total: string; totalUnread: string }> {
    return this.service.getMyNotificationSummary(user.id);
  }

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
