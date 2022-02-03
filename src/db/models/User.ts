import { knex, TutorStudent } from 'src/db/models';
import { QueryBuilder } from 'objection';
import Role from './Role';
import BaseModel, { ModelFields } from './BaseModel';
import { Profile } from '.';
import Tutor from './Tutor';
import Student from './Student';

export default class User extends BaseModel {
  roleId: string;

  email: string;
  password: string;
  isActive: boolean;
  verifyEmailCode: string;
  forgotPasswordCode: string;
  paypalEmail: string;

  role?: ModelFields<Role>;
  profile?: ModelFields<Profile>;
  teachings?: ModelFields<TutorStudent>[];
  tutor?: ModelFields<Tutor>;
  student?: ModelFields<Student>;

  isTutor?: boolean;

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
        relation: BaseModel.HasOneRelation,
        modelClass: Profile,
        join: {
          from: 'users.id',
          to: 'profile.userId',
        },
      },
      tutor: {
        relation: BaseModel.HasOneRelation,
        modelClass: Tutor,
        join: {
          from: 'users.id',
          to: 'tutor.userId',
        },
      },
      student: {
        relation: BaseModel.HasOneRelation,
        modelClass: Student,
        join: {
          from: 'users.id',
          to: 'student.userId',
        },
      },
    };
  }

  static modifiers = {
    defaultSelect(qb: QueryBuilder<BaseModel>) {
      qb.select('email').withGraphFetched('profile(defaultSelect)');
    },
    selectInLogin(qb: QueryBuilder<BaseModel>) {
      qb.select('email', 'password', 'isActive').withGraphFetched(
        'profile(defaultSelect)',
      );
    },
    adminSelect(qb: QueryBuilder<BaseModel>) {
      qb.select('id', 'email', 'isActive', 'createdAt').withGraphFetched(
        'profile(defaultSelect)',
      );
    },
    selectInGetMe(qb: QueryBuilder<BaseModel>) {
      qb.select(
        'id',
        'email',
        'paypalEmail',
        knex.raw(
          '((Select "userId" from tutor where "userId" = users.id) is not NULL) as "isTutor"',
        ),
        knex.raw(
          '((Select "userId" from student where "userId" = users.id) is not NULL) as "isStudent"',
        ),
      ).withGraphFetched('[profile(defaultSelect)]');
    },
  };
}
