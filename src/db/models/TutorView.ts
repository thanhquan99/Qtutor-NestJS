import { QueryBuilder } from 'objection';
import { Profile, Subject, TutorSubject } from 'src/db/models';
import BaseModel, { ModelFields } from './BaseModel';

export default class TutorView extends BaseModel {
  description: string;
  isPublished: boolean;
  minimumSalary: number;
  isSpecial: boolean;
  yearsExperience: number;
  totalRatings: number;
  averageRating: number;

  userId: string;

  profile?: ModelFields<Profile>;
  subjects?: ModelFields<Subject>[];
  tutorSubjects?: ModelFields<TutorSubject>[];

  static get tableName() {
    return 'tutor_view';
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
      profile: {
        relation: BaseModel.HasOneRelation,
        modelClass: Profile,
        join: {
          from: 'tutor_view.userId',
          to: 'profile.userId',
        },
      },
    };
  }

  static modifiers = {
    defaultSelect(qb: QueryBuilder<BaseModel>) {
      qb.select(
        'id',
        'description',
        'minimumSalary',
        'isSpecial',
        'userId',
        'yearsExperience',
        'totalRatings',
        'averageRating',
      ).withGraphFetched('[profile(defaultSelect)]');
    },
  };
}
