import { QueryBuilder } from 'objection';
import { TutorStudent } from '.';
import BaseModel, { ModelFields } from './BaseModel';

export default class Schedule extends BaseModel {
  description: string;
  duration: string;
  startTime: Date;
  endTime: Date;
  isFreeTime: boolean;

  userId: string;
  tutorStudentId: string;

  tutorStudent?: ModelFields<TutorStudent>;

  static get tableName() {
    return 'schedule';
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static get relationMappings() {
    return {
      tutorStudent: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: TutorStudent,
        join: {
          from: 'schedule.tutorStudentId',
          to: 'tutor_student.id',
        },
      },
    };
  }

  static modifiers = {
    defaultSelect(qb: QueryBuilder<BaseModel>) {
      qb.select(
        'id',
        'description',
        'startTime',
        'endTime',
        'userId',
        'tutorStudentId',
        'isFreeTime',
      ).withGraphFetched('tutorStudent(defaultSelect)');
    },
    getFreeTime(qb: QueryBuilder<BaseModel>) {
      qb.select('id', 'startTime', 'endTime', 'userId', 'isFreeTime').where({
        isFreeTime: true,
      });
    },
  };
}
