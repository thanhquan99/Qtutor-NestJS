import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE tutor
    ADD COLUMN "isSpecial" BOOLEAN NOT NULL DEFAULT FALSE;

    ALTER TABLE student
    ADD COLUMN "isSpecial" BOOLEAN NOT NULL DEFAULT FALSE;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE tutor
    DROP COLUMN "isSpecial";

    ALTER TABLE student
    DROP COLUMN "isSpecial";
  `);
}
