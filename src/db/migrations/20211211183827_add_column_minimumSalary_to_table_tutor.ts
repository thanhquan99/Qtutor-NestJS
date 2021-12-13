import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE tutor
    ADD COLUMN "minimumSalary" bigint
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE tutor
    DROP COLUMN "minimumSalary"
  `);
}
