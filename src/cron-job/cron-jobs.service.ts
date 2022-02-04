import { ModelFields } from 'src/db/models/BaseModel';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DEFAULT_EMAIL, TransactionStatus } from '../constant';
import { Schedule, Transaction } from '../db/models';

@Injectable()
export class CronJobsService {
  constructor(public readonly mailService: MailerService) {}

  @Cron('0 */10 * * * *')
  async handleCron() {
    const now = new Date();
    const lastSunday = new Date(now.setDate(now.getDate() - now.getDay()));
    const lastSundayMidNight = lastSunday.setHours(0, 0, 0, 0);
    const sundayInDB = new Date('2022/01/09').getTime();
    const distance = lastSundayMidNight - sundayInDB;

    const compareDate = new Date(Date.now() - distance + 1000 * 60 * 10);
    const schedulePlans = await Schedule.query()
      .whereNotNull('tutorStudentId')
      .andWhere('startTime', '<', compareDate.toISOString())
      .andWhere(
        'startTime',
        '>=',
        new Date(new Date().getTime() - distance).toISOString(),
      )
      .modify('defaultSelect');

    const sendMailFuncs = schedulePlans.map((schedule) => {
      let content: string;
      const startTime = new Date(
        new Date(schedule.startTime).getTime() + 1000 * 60 * 60 * 7,
      );
      const endTime = new Date(
        new Date(schedule.endTime).getTime() + 1000 * 60 * 60 * 7,
      );

      if (schedule.tutorStudent?.student?.userId === schedule.userId) {
        content = `You have a <b>${
          schedule.tutorStudent?.subject?.name
        }</b> class schedule with teacher <b>${
          schedule.tutorStudent.tutor?.profile?.name
        }</b> from <b>${startTime.toLocaleTimeString(
          'vi-VN',
        )}</b> to <b>${endTime.toLocaleTimeString('vi-VN')}</b> `;
      }

      if (schedule.tutorStudent?.tutor?.userId === schedule.userId) {
        content = `You have a <b>${
          schedule.tutorStudent?.subject?.name
        }</b> lesson schedule for student <b>${
          schedule.tutorStudent.student?.profile?.name
        }</b> from <b>${startTime.toLocaleTimeString(
          'vi-VN',
        )}</b> to <b>${endTime.toLocaleTimeString('vi-VN')}</b>`;
      }

      return this.mailService.sendMail({
        to: DEFAULT_EMAIL,
        subject: 'Schedule Announcement',
        html: content, // HTML body content
      });
    });
    await Promise.all(sendMailFuncs);

    const current = new Date();
    const transactions = schedulePlans
      .filter(
        (value, index, self) =>
          index ===
          self.findIndex((t) => t.tutorStudentId === value.tutorStudentId),
      ) //Remove duplicate tutorStudentId
      .map(
        (e): ModelFields<Transaction> => ({
          price: e.tutorStudent?.salary,
          status: TransactionStatus.UNPAID,
          isPaid: false,
          tutorUserId: e.tutorStudent.tutor?.userId,
          studentUserId: e.tutorStudent?.student?.userId,
          subjectId: e.tutorStudent?.subjectId,
          startTime: new Date(
            current.getFullYear(),
            current.getMonth(),
            current.getDay(),
            new Date(e.startTime).getHours(),
            new Date(e.startTime).getMinutes(),
          ).toISOString(),
          endTime: new Date(
            current.getFullYear(),
            current.getMonth(),
            current.getDay(),
            new Date(e.endTime).getHours(),
            new Date(e.endTime).getMinutes(),
          ).toISOString(),
        }),
      );
    await Transaction.query().insert(transactions);
  }
}
