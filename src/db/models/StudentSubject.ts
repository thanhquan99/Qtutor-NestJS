import BaseModel from './BaseModel';

export default class StudentSubject extends BaseModel {
  studentId: string;
  subjectId: string;

  static get tableName() {
    return 'student_subject';
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
