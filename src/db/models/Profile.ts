import { QueryBuilder } from 'objection';
import User from './User';
import BaseModel, { ModelFields } from './BaseModel';

export default class Profile extends BaseModel {
  userId: string;

  name: string;
  dateOfBirth: Date;
  avatar: string;
  academicLevel: string;
  additionalInformation: string;

  user?: ModelFields<User>;

  static get tableName() {
    return 'profile';
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
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'profile.userId',
          to: 'users.id',
        },
      },
    };
  }

  static modifiers = {
    defaultSelect(qb: QueryBuilder<BaseModel>) {
      qb.select(
        'name',
        'dateOfBirth',
        'avatar',
        'academicLevel',
        'additionalInformation',
      );
    },
  };
}