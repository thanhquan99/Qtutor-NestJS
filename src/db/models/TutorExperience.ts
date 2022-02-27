import { QueryBuilder } from 'objection';
import BaseModel from './BaseModel';

export default class TutorExperience extends BaseModel {
  tutorId: string;
  title: string;
  description: string;

  static get tableName() {
    return 'tutor_experience';
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
      qb.select('*');
    },
  };
}
