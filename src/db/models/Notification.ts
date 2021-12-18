import { QueryBuilder } from 'objection';
import BaseModel from './BaseModel';
import User from './User';

export default class Notification extends BaseModel {
  message: string;
  isRead: boolean;
  type: string;
  url: string;
  extraType: string;

  userId: string;
  senderId: string;
  extraId: string;

  static get tableName() {
    return 'notification';
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static get relationMappings() {
    return {
      sender: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'notification.senderId',
          to: 'users.id',
        },
      },
    };
  }

  static modifiers = {
    defaultSelect(qb: QueryBuilder<BaseModel>) {
      qb.select(
        'id',
        'userId',
        'message',
        'isRead',
        'type',
        'url',
        'createdAt',
      ).withGraphFetched('[sender(defaultSelect)]');
    },
  };
}
