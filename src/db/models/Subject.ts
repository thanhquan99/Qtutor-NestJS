import BaseModel from './BaseModel';

export default class Subject extends BaseModel {
  name: string;

  static get tableName() {
    return 'subject';
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
