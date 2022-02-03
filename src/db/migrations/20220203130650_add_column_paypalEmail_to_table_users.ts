import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE users
    ADD COLUMN "paypalEmail" VARCHAR(255)
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE users
    DROP COLUMN "paypalEmail"
  `);
}
