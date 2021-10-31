import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE profile (
      id BIGINT PRIMARY KEY DEFAULT (generate_id()),
      "userId" BIGINT NOT NULL,
      name VARCHAR(255) NOT NULL,
      "dateOfBirth" TIMESTAMP WITH TIME ZONE,
      "avatar" TEXT,
      "academicLevel" VARCHAR(255),
      "additionalInformation" TEXT,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_users
        FOREIGN KEY("userId") 
        REFERENCES users(id)
        ON DELETE CASCADE
    )
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP table profile`);
}
