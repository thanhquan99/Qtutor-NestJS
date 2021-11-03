import { ROLE } from '../../constant';
import { Role } from '../models';
import Knex from 'knex';
import { User } from '../models';
import * as bcrypt from 'bcrypt';
const password = bcrypt.hashSync('123456789', '$2b$10$leL65eC89pj8mWzejdSVbe');

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE users (
      id BIGINT PRIMARY KEY DEFAULT (generate_id()),
      "roleId" BIGINT,
      email VARCHAR(255),
      password TEXT,
      "verifyEmailCode" TEXT,
      "forgotPasswordCode" TEXT,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(email),

      CONSTRAINT fk_role
        FOREIGN KEY("roleId") 
        REFERENCES role(id)
        ON DELETE SET NULL
    )
  `);

  const role = await Role.query(knex).findOne({ name: ROLE.SUPER_ADMIN });
  await User.query(knex).insert({
    email: 'superadmin@gmail.com',
    password,
    roleId: role.id,
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP table users`);
}
