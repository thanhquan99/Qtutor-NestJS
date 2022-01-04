import { ModelFields } from 'src/db/models/BaseModel';
import { QueryBuilder } from 'objection';
import { Profile, StudentSubject, Subject } from 'src/db/models';
import BaseModel from './BaseModel';

export default class Student extends BaseModel {
  description: string;
  isSpecial: string;

  userId: string;

  profile?: ModelFields<Profile>;
  subjects?: ModelFields<Subject>[];

  static get tableName() {
    return 'student';
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
          from: 'student.id',
          through: {
            from: 'student_subject.studentId',
            to: 'student_subject.subjectId',
          },
          to: 'subject.id',
        },
      },
      studentSubjects: {
        relation: BaseModel.HasManyRelation,
        modelClass: StudentSubject,
        join: {
          from: 'student.id',
          to: 'student_subject.studentId',
        },
      },
      profile: {
        relation: BaseModel.HasOneRelation,
        modelClass: Profile,
        join: {
          from: 'student.userId',
          to: 'profile.userId',
        },
      },
    };
  }

  static modifiers = {
    defaultSelect(qb: QueryBuilder<BaseModel>) {
      qb.select('id', 'description', 'isSpecial', 'userId').withGraphFetched(
        '[profile(defaultSelect), subjects(defaultSelect)]',
      );
    },
    selectInTutorStudent(qb: QueryBuilder<BaseModel>) {
      qb.select('id', 'description', 'userId').withGraphFetched(
        'profile(defaultSelect)',
      );
    },
  };
}
