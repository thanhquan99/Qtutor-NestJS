import { City, knex } from 'src/db/models';
import { QueryBuilder } from 'objection';
import User from './User';
import BaseModel, { ModelFields } from './BaseModel';

export default class Profile extends BaseModel {
  name: string;
  dateOfBirth: Date;
  avatar: string;
  academicLevel: string;
  additionalInformation: string;
  isMale: boolean;
  workLocation: string;

  userId: string;
  cityId: string;

  user?: ModelFields<User>;

  static get tableName() {
    return 'profile';
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
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'profile.userId',
          to: 'users.id',
        },
      },
      city: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: City,
        join: {
          from: 'profile.cityId',
          to: 'city.id',
        },
      },
    };
  }

  static modifiers = {
    defaultSelect(qb: QueryBuilder<BaseModel>) {
      qb.select(
        'name',
        'dateOfBirth',
        'avatar',
        'academicLevel',
        'additionalInformation',
        'isMale',
        'workLocation',
      ).withGraphFetched('city(defaultSelect)');
    },
    selectCityName(qb: QueryBuilder<BaseModel>) {
      qb.select(
        knex.raw(
          '(SELECT name from city where city.id = profile."cityId" limit 1) as "cityName"',
        ),
      );
    },
  };
}
