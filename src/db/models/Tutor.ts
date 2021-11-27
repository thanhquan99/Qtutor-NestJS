import { Subject, TutorSubject } from 'src/db/models';
import BaseModel from './BaseModel';

export default class Tutor extends BaseModel {
  userId: string;
  description: string;

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
        relation: BaseModel.HasManyRelation,
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
    };
  }
}
