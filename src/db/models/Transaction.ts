import { QueryBuilder } from 'objection';
import { Subject } from 'src/db/models';
import BaseModel, { ModelFields } from './BaseModel';
import User from './User';

export default class Transaction extends BaseModel {
  price: number;
  payType: string;
  status: string;
  isPaid: boolean;
  startTime: string;
  endTime: string;

  tutorUserId: string;
  studentUserId: string;
  subjectId: string;
  modifiedBy: string;

  tutorUser?: ModelFields<User>;
  studentUser?: ModelFields<User>;
  subject?: ModelFields<Subject>;
  modifiedUser?: ModelFields<User>;

  isEdit?: boolean;
  isCanPay?: boolean;

  static get tableName() {
    return 'transaction';
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
      tutorUser: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'transaction.tutorUserId',
          to: 'users.id',
        },
      },
      studentUser: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'transaction.studentUserId',
          to: 'users.id',
        },
      },
      modifiedUser: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'transaction.modifiedBy',
          to: 'users.id',
        },
      },
      subject: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Subject,
        join: {
          from: 'transaction.subjectId',
          to: 'subject.id',
        },
      },
    };
  }

  static modifiers = {
    defaultSelect(qb: QueryBuilder<BaseModel>) {
      qb.select('*').withGraphFetched(
        '[tutorUser(defaultSelect), studentUser(defaultSelect), subject(defaultSelect), modifiedUser(defaultSelect)]',
      );
    },
  };
}
