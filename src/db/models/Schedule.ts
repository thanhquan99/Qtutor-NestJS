import BaseModel from './BaseModel';

export default class Schedule extends BaseModel {
  description: string;
  duration: string;
  startTime: Date;
  endTime: Date;

  userId: string;
  tutorStudentId: string;

  static get tableName() {
    return 'schedule';
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
