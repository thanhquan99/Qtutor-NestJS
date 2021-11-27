import { Subject, TutorSubject, Profile } from 'src/db/models';
import BaseModel from './BaseModel';

export default class Tutor extends BaseModel {
  description: string;
  isPublished: boolean;

  userId: string;

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
    };
  }
}
