import { User } from 'src/db/models';
import { QueryBuilder } from 'objection';
import BaseModel from './BaseModel';

export default class TutorRating extends BaseModel {
  tutorId: string;
  reviewerId: string;
  rating: number;
  comment: string;

  static get tableName() {
    return 'tutor_rating';
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
      reviewer: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tutor_rating.reviewerId',
          to: 'users.id',
        },
      },
    };
  }

  static modifiers = {
    defaultSelect(qb: QueryBuilder<BaseModel>) {
      qb.select('id', 'rating', 'comment').withGraphFetched(
        'reviewer(defaultSelect)',
      );
    },
  };
}
