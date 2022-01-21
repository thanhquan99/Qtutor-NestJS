import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE tutor_student
    ADD COLUMN "sessionsOfWeek" INT
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE tutor_student
    DROP COLUMN "sessionsOfWeek"
  `);
}
