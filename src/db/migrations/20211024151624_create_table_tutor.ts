import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE tutors (
      id BIGINT PRIMARY KEY DEFAULT (generate_id()),
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(255),
      email VARCHAR(255) NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP table tutors`);
}
