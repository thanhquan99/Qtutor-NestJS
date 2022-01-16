import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE tutor_subject
    ADD COLUMN "sessionsOfWeek" INT,
    ADD COLUMN price BIGINT;

    ALTER TABLE student_subject
    ADD COLUMN "sessionsOfWeek" INT,
    ADD COLUMN price BIGINT;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE tutor_subject
    DROP COLUMN "sessionsOfWeek",
    DROP COLUMN price;

    ALTER TABLE student_subject
    DROP COLUMN "sessionsOfWeek",
    DROP COLUMN price;
  `);
}
