import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE profile
    ADD COLUMN "workLocation" TEXT
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE profile
    DROP COLUMN "workLocation"
  `);
}
