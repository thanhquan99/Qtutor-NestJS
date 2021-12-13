import { QueryBuilder } from 'objection';
import { Subject } from 'src/db/models';
import BaseModel from './BaseModel';

export default class TeachingPrice extends BaseModel {
  tutorId: string;
  subjectId: string;
  sessionsOfWeek: number;
  price: number;

  static get tableName() {
    return 'teaching_price';
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
          from: 'teaching_price.subjectId',
          to: 'subject.id',
        },
      },
    };
  }

  static modifiers = {
    defaultSelect(qb: QueryBuilder<BaseModel>) {
      qb.select('id', 'sessionsOfWeek', 'price').withGraphFetched(
        '[subject(defaultSelect)]',
      );
    },
  };
}
