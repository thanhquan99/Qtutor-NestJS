import { QueryBuilder } from 'objection';
import { Subject } from '.';
import BaseModel, { ModelFields } from './BaseModel';

export default class StudentSubject extends BaseModel {
  studentId: string;
  subjectId: string;
  sessionsOfWeek: number;
  price: number;

  subject?: ModelFields<Subject>;

  static get tableName() {
    return 'student_subject';
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
      subject: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Subject,
        join: {
          from: 'student_subject.subjectId',
          to: 'subject.id',
        },
      },
    };
  }

  static modifiers = {
    defaultSelect(qb: QueryBuilder<BaseModel>) {
      qb.select(
        'id',
        'sessionsOfWeek',
        'price',
        'subjectId',
        'studentId',
      ).withGraphFetched('[subject(defaultSelect)]');
    },
  };
}
