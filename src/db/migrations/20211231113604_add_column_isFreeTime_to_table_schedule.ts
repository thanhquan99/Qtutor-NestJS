import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE schedule
    ADD COLUMN "isFreeTime" BOOLEAN NOT NULL DEFAULT FALSE
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE schedule
    DROP COLUMN "isFreeTime"
  `);
}
