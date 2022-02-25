import { Student, Tutor } from '../../db/models';
import { ModelFields } from './../../db/models/BaseModel';

export interface ISchedule {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  isFreeTime: boolean;
  tutor: ModelFields<Tutor>;
  student: ModelFields<Student>;
  isEdit: boolean;
}
