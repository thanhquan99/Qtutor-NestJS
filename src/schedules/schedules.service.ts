import { DefaultDate, ScheduleDays } from './../constant/index';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import Schedule from 'src/db/models/Schedule';
import { CreateScheduleDto } from './dto';
import { TutorStudent } from 'src/db/models';
import { modifySchedule } from './utils';
import { ISchedule } from './interface';

@Injectable()
export class SchedulesService extends BaseServiceCRUD<Schedule> {
  constructor() {
    super(Schedule, 'Schedule');
  }

  async createSchedule(
    payload: CreateScheduleDto,
    userId: string,
  ): Promise<ISchedule> {
    const { startTimeDate, endTimeDate, tutorStudentId, description } = payload;
    const startTime = new Date(
      DefaultDate.YEAR,
      DefaultDate.MONTH,
      ScheduleDays[startTimeDate.dayOfWeek],
      startTimeDate.hour,
      startTimeDate.minute,
    );
    const endTime = new Date(
      DefaultDate.YEAR,
      DefaultDate.MONTH,
      ScheduleDays[endTimeDate.dayOfWeek],
      endTimeDate.hour,
      endTimeDate.minute,
    );
    if (startTime >= endTime) {
      throw new BadRequestException('Invalid date');
    }

    if (tutorStudentId) {
      const tutorStudent = await TutorStudent.query().findById(tutorStudentId);
      if (!tutorStudent) {
        throw new NotFoundException('Tutor Student not found');
      }
    }

    const schedule = await Schedule.query().insertAndFetch({
      startTime,
      endTime,
      userId,
      tutorStudentId,
      description,
    });

    return await modifySchedule(schedule);
  }

  async getMySchedules(userId: string): Promise<ISchedule[]> {
    const schedules = await Schedule.query().where({ userId });

    return await Promise.all(
      schedules.map((schedule) => modifySchedule(schedule)),
    );
  }
}
