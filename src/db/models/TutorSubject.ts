import BaseModel from './BaseModel';

export default class TutorSubject extends BaseModel {
  tutorId: string;
  subjectId: string;
  sessionsOfWeek: number;
  price: number;

  static get tableName() {
    return 'tutor_subject';
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
