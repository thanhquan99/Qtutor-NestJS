import BaseModel from './BaseModel';

export default class User extends BaseModel {
  name: string;
  phone: string;
  email: string;
  password: string;

  static get tableName() {
    return 'users';
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
