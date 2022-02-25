import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE tutor
    ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT FALSE;

    ALTER TABLE student
    ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT FALSE;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE tutor
    DROP COLUMN "isActive";

    ALTER TABLE student
    DROP COLUMN "isActive";
  `);
}
