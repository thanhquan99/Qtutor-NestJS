import { ROLE } from '../../constant';
import Knex from 'knex';
import { Role } from '../models';

export async function up(knex: Knex): Promise<void> {
  const insertRoleQuery = Role.query()
    .insert([{ name: ROLE.CUSTOMER }, { name: ROLE.SUPER_ADMIN }])
    .toKnexQuery()
    .toQuery();

  await knex.raw(`
    CREATE TABLE role (
      id BIGINT PRIMARY KEY DEFAULT (generate_id()),
      name VARCHAR(255),
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    ${insertRoleQuery}
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP table role`);
}
