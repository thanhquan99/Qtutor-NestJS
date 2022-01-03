import { QueryBuilder } from 'objection';
import BaseModel from './BaseModel';

export default class AppConfig extends BaseModel {
  name: string;
  key: string;
  value: string;

  static get tableName() {
    return 'config';
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static modifiers = {
    defaultSelect(qb: QueryBuilder<BaseModel>) {
      qb.select('name', 'key', 'value');
    },
  };
}
