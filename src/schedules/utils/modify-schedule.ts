import { BadRequestException } from '@nestjs/common';
import { Schedule, TutorStudent } from 'src/db/models';
import { ISchedule } from '../interface';

export const modifySchedule = async (
  schedule: Schedule,
): Promise<ISchedule> => {
  let title = 'Default title';

  if (schedule.description) {
    title = schedule.description;
  }

  if (schedule.tutorStudentId) {
    const tutorStudent = await TutorStudent.query()
      .modify('defaultSelect')
      .findById(schedule.tutorStudentId);
    if (!tutorStudent) {
      throw new BadRequestException(
        'Something wrong with this data. Contact admin',
      );
    }

    if (tutorStudent.student.userId === schedule.userId) {
      title = `Teacher ${tutorStudent.tutor.profile.name} - ${tutorStudent.subject.name}`;
    }
    if (tutorStudent.tutor.userId === schedule.userId) {
      title = `Student ${tutorStudent.student.profile.name} - ${tutorStudent.subject.name}`;
    }
  }

  return {
    title,
    startDate: schedule.startTime,
    endDate: schedule.endTime,
  };
};
