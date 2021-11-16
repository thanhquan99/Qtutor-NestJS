import { ROLE } from './../../constant/index';
import Knex from 'knex';
import { Role, User } from '../models';
import * as bcrypt from 'bcrypt';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE profile (
      id BIGINT PRIMARY KEY DEFAULT (generate_id()),
      "userId" BIGINT NOT NULL,
      name VARCHAR(255) NOT NULL,
      "dateOfBirth" TIMESTAMP WITH TIME ZONE,
      "avatar" TEXT,
      "academicLevel" VARCHAR(255),
      "additionalInformation" TEXT,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_users
        FOREIGN KEY("userId") 
        REFERENCES users(id)
        ON DELETE CASCADE
    )
  `);

  const role = await Role.query(knex).findOne({ name: ROLE.SUPER_ADMIN });
  const password = bcrypt.hashSync(
    '123456789',
    '$2b$10$leL65eC89pj8mWzejdSVbe',
  );
  await User.query(knex).insertGraph({
    email: 'superadmin@gmail.com',
    password,
    roleId: role.id,
    isActive: true,
    profile: {
      name: 'Admin',
    },
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP table profile`);
}
