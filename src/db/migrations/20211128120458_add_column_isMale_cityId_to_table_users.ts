import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE profile
    ADD COLUMN "isMale" BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN "cityId" BIGINT,

    ADD CONSTRAINT fk_city
      FOREIGN KEY("cityId") 
      REFERENCES city(id)
      ON DELETE CASCADE
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE profile
    DROP COLUMN "isMale",
    DROP COLUMN "cityId"
  `);
}
