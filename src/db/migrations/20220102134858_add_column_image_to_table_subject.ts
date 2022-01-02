import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE subject
    ADD COLUMN image TEXT
  `);

  await knex.table('subject').update({
    image:
      'https://img.jagranjosh.com/imported/images/E/Articles/deleted-topics-of-cbse-12th-math-syllabus-2020-21.jpg',
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE subject
    DROP COLUMN image
  `);
}
