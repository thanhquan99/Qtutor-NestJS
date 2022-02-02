import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE transaction
    ADD COLUMN "status" VARCHAR(255)
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE transaction
    DROP COLUMN "status"
  `);
}
