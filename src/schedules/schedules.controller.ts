import { SchedulesService } from './schedules.service';
import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { ROLE } from 'src/constant';
import { User, Schedule } from 'src/db/models';
import { Role } from 'src/guards/role.decorator';
import { CreateScheduleDto } from './dto';
import _ from 'lodash';
import { ISchedule } from './interface';

@Controller('schedules')
export class SchedulesController {
  public readonly service = new SchedulesService();

  @Post()
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  @UsePipes(ValidationPipe)
  createOne(
    @GetUser() user: User,
    @Body() payload: CreateScheduleDto,
  ): Promise<ISchedule> {
    if (_.isEmpty(payload.description) === _.isEmpty(payload.tutorStudentId)) {
      throw new BadRequestException('Bad request check body again');
    }

    return this.service.createSchedule(payload, user.id);
  }

  @Get('/me')
  @ApiBearerAuth()
  @Role(ROLE.CUSTOMER)
  @UsePipes(ValidationPipe)
  getMySchedules(@GetUser() user: User): Promise<ISchedule[]> {
    return this.service.getMySchedules(user.id);
  }
}
