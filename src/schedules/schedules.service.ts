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
    const {
      startTimeDate,
      endTimeDate,
      tutorStudentId,
      description,
      isFreeTime,
    } = payload;
    const startTime = new Date(
      `${DefaultDate.YEAR}-${DefaultDate.MONTH}-${
        ScheduleDays[startTimeDate.dayOfWeek]
      } ${startTimeDate.hour}:${startTimeDate.minute}:00+07`,
    );
    const endTime = new Date(
      `${DefaultDate.YEAR}-${DefaultDate.MONTH}-${
        ScheduleDays[endTimeDate.dayOfWeek]
      } ${endTimeDate.hour}:${endTimeDate.minute}:00+07`,
    );
    if (startTime >= endTime) {
      throw new BadRequestException('Invalid date');
    }

    const [overlapSchedule] = await Schedule.query()
      .select('id')
      .where({ userId, isFreeTime: false })
      .andWhereRaw(`(?, ?) OVERLAPS ("startTime", "endTime")`, [
        startTime.toISOString(),
        endTime.toISOString(),
      ])
      .limit(1);
    if (overlapSchedule) {
      throw new BadRequestException('Overlap date');
    }

    if (tutorStudentId) {
      const tutorStudent = await TutorStudent.query()
        .modify('defaultSelect')
        .findById(tutorStudentId);
      if (!tutorStudent) {
        throw new NotFoundException('Tutor Student not found');
      }

      // Check overlap date for student
      const [overlapSchedule] = await Schedule.query()
        .select('id')
        .where({ userId: tutorStudent.student?.userId, isFreeTime: false })
        .andWhereRaw(`(?, ?) OVERLAPS ("startTime", "endTime")`, [
          startTime.toISOString(),
          endTime.toISOString(),
        ])
        .limit(1);
      if (overlapSchedule) {
        throw new BadRequestException(`Overlap date in student's schedule`);
      }
    }

    const trx = await Schedule.startTransaction();
    try {
      const schedule = await Schedule.query(trx)
        .insertAndFetch({
          startTime,
          endTime,
          userId,
          tutorStudentId,
          description,
          isFreeTime,
        })
        .modify('defaultSelect');

      // Remove Overlap Free time
      await Schedule.query(trx)
        .where({ userId, isFreeTime: true })
        .andWhereRaw(`(?, ?) OVERLAPS ("startTime", "endTime")`, [
          startTime.toISOString(),
          endTime.toISOString(),
        ])
        .andWhere('id', '!=', schedule.id)
        .delete();

      // Insert Schedule and Remove Overlap Free time for student
      if (schedule.tutorStudent?.student?.userId) {
        const studentSchedule = await Schedule.query(trx)
          .insertAndFetch({
            startTime,
            endTime,
            userId: schedule.tutorStudent.student.userId,
            tutorStudentId,
            description,
            isFreeTime,
          })
          .modify('defaultSelect');

        await Schedule.query(trx)
          .where({
            userId: studentSchedule.userId,
            isFreeTime: true,
          })
          .andWhereRaw(`(?, ?) OVERLAPS ("startTime", "endTime")`, [
            startTime.toISOString(),
            endTime.toISOString(),
          ])
          .andWhere('id', '!=', studentSchedule.id)
          .delete();
      }

      await trx.commit();
      return await modifySchedule(schedule);
    } catch (error) {
      await trx.rollback();
    }
  }

  async getMySchedules(userId: string): Promise<ISchedule[]> {
    const schedules = await Schedule.query()
      .where({ userId })
      .modify('defaultSelect');

    return schedules.map((schedule) => modifySchedule(schedule));
  }

  async deleteSchedule(
    userId: string,
    id: string,
  ): Promise<{ message: string }> {
    const schedule = await Schedule.query()
      .findOne({ userId, id })
      .modify('defaultSelect');
    if (schedule) {
      if (schedule.tutorStudentId) {
        if (schedule.tutorStudent.tutor.userId !== userId) {
          throw new BadRequestException('Only tutor can delete this');
        }
        await Schedule.query()
          .where({
            tutorStudentId: schedule.tutorStudentId,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
          })
          .delete();
      }
      await schedule.$query().delete();
    }

    return { message: 'Delete successfully' };
  }
}
