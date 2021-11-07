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
}
