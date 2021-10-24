import BaseModel from './BaseModel';

export default class Tutor extends BaseModel {
  name: string;
  phone: string;
  email: string;

  static get tableName() {
    return 'tutors';
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
