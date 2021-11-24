import BaseModel from './BaseModel';

export default class City extends BaseModel {
  name: string;

  static get tableName() {
    return 'city';
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
