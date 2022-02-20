import { Schedule } from 'src/db/models';
import { ISchedule } from '../interface';

export const modifySchedule = (schedule: Schedule): ISchedule => {
  let title = 'Default title';
  let tutor;
  let student;

  if (schedule.description) {
    title = schedule.description;
  }

  if (schedule.tutorStudentId) {
    const { tutorStudent } = schedule;

    if (tutorStudent.student.userId === schedule.userId) {
      title = `Study ${tutorStudent.subject.name} - Teacher ${tutorStudent.tutor.profile.name}`;
      tutor = schedule.tutorStudent?.tutor;
    }
    if (tutorStudent.tutor.userId === schedule.userId) {
      title = `Teach ${tutorStudent.subject.name} - Student ${tutorStudent.student.profile.name}`;
      student = schedule.tutorStudent?.student;
    }
  }

  return {
    id: schedule.id,
    title,
    startDate: schedule.startTime,
    endDate: schedule.endTime,
    tutor,
    student,
  };
};
