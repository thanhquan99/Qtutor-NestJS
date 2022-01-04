import { QueryBuilder } from 'objection';
import { Subject, TutorSubject, Profile } from 'src/db/models';
import BaseModel, { ModelFields } from './BaseModel';
import TeachingPrice from './TeachingPrice';

export default class Tutor extends BaseModel {
  description: string;
  isPublished: boolean;
  minimumSalary: number;
  isSpecial: boolean;

  userId: string;

  profile?: ModelFields<Profile>;
  subjects?: ModelFields<Subject>[];

  static get tableName() {
    return 'tutor';
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
      subjects: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Subject,
        join: {
          from: 'tutor.id',
          through: {
            from: 'tutor_subject.tutorId',
            to: 'tutor_subject.subjectId',
          },
          to: 'subject.id',
        },
      },
      tutorSubjects: {
        relation: BaseModel.HasManyRelation,
        modelClass: TutorSubject,
        join: {
          from: 'tutor.id',
          to: 'tutor_subject.tutorId',
        },
      },
      profile: {
        relation: BaseModel.HasOneRelation,
        modelClass: Profile,
        join: {
          from: 'tutor.userId',
          to: 'profile.userId',
        },
      },
      teachingPrices: {
        relation: BaseModel.HasManyRelation,
        modelClass: TeachingPrice,
        join: {
          from: 'tutor.id',
          to: 'teaching_price.tutorId',
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
      ).withGraphFetched('[profile(defaultSelect), subjects(defaultSelect)]');
    },
    selectInGetOne(qb: QueryBuilder<BaseModel>) {
      qb.modify('defaultSelect').withGraphFetched(
        '[teachingPrices(defaultSelect)]',
      );
    },
    selectInTutorStudent(qb: QueryBuilder<BaseModel>) {
      qb.select('id', 'userId').withGraphFetched('[profile(defaultSelect)]');
    },
    selectInSuggestion(qb: QueryBuilder<BaseModel>) {
      qb.select(
        'id',
        'description',
        'minimumSalary',
        'isSpecial',
      ).withGraphFetched('profile(defaultSelect)');
    },
  };
}
