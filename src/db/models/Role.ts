import BaseModel from './BaseModel';

export default class Role extends BaseModel {
  name: string;

  static get tableName() {
    return 'role';
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
