import { Schedule } from 'src/db/models';
import { ISchedule } from '../interface';

export const modifySchedule = (schedule: Schedule): ISchedule => {
  let title = 'Default title';

  if (schedule.description) {
    title = schedule.description;
  }

  if (schedule.tutorStudentId) {
    const { tutorStudent } = schedule;

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
