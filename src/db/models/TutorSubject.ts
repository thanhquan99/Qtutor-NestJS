import { QueryBuilder } from 'objection';
import { Subject } from '.';
import BaseModel from './BaseModel';

export default class TutorSubject extends BaseModel {
  tutorId: string;
  subjectId: string;
  sessionsOfWeek: number;
  price: number;

  static get tableName() {
    return 'tutor_subject';
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
          from: 'tutor_subject.subjectId',
          to: 'subject.id',
        },
      },
    };
  }

  static modifiers = {
    defaultSelect(qb: QueryBuilder<BaseModel>) {
      qb.select(
        'id',
        'tutorId',
        'subjectId',
        'sessionsOfWeek',
        'price',
      ).withGraphFetched('[subject(defaultSelect)]');
    },
  };
}
