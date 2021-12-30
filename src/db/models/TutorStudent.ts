import { QueryBuilder } from 'objection';
import { Subject } from 'src/db/models';
import BaseModel, { ModelFields } from './BaseModel';
import Student from './Student';
import Tutor from './Tutor';

export default class TutorStudent extends BaseModel {
  salary: number;
  status: string;

  tutorId: string;
  studentId: string;
  subjectId: string;

  tutor?: ModelFields<Tutor>;
  student?: ModelFields<Student>;
  subject?: ModelFields<Subject>;

  static get tableName() {
    return 'tutor_student';
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
          from: 'tutor_student.subjectId',
          to: 'subject.id',
        },
      },
      tutor: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Tutor,
        join: {
          from: 'tutor_student.tutorId',
          to: 'tutor.id',
        },
      },
      student: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Student,
        join: {
          from: 'tutor_student.studentId',
          to: 'student.id',
        },
      },
    };
  }

  static modifiers = {
    defaultSelect(qb: QueryBuilder<BaseModel>) {
      qb.select('id', 'salary', 'status').withGraphFetched(
        '[tutor(selectInTutorStudent), student(selectInTutorStudent), subject(defaultSelect)]',
      );
    },
  };
}
