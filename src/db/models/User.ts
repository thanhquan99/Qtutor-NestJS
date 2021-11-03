import { QueryBuilder } from 'objection';
import Role from './Role';
import BaseModel, { ModelFields } from './BaseModel';
import { Profile } from '.';

export default class User extends BaseModel {
  roleId: bigint;

  email: string;
  password: string;
  isActive: boolean;
  verifyEmailCode: string;
  forgotPasswordCode: string;

  role?: ModelFields<Role>;
  profile?: ModelFields<Profile>;

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

  static get relationMappings() {
    return {
      role: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: 'users.roleId',
          to: 'role.id',
        },
      },

      profile: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Profile,
        join: {
          from: 'users.id',
          to: 'profile.userId',
        },
      },
    };
  }

  static modifiers = {
    defaultSelect(qb: QueryBuilder<BaseModel>) {
      qb.select('email').withGraphFetched('profile');
    },
    selectInLogin(qb: QueryBuilder<BaseModel>) {
      qb.select('email', 'password').withGraphFetched('profile');
    },
  };
}
