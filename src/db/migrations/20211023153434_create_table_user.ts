import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE users (
      id BIGINT PRIMARY KEY DEFAULT (generate_id()),
      "roleId" BIGINT,
      email VARCHAR(255),
      password TEXT,
      "isActive" BOOLEAN NOT NULL DEFAULT FALSE,
      "verifyEmailCode" TEXT,
      "forgotPasswordCode" TEXT,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(email),

      CONSTRAINT fk_role
        FOREIGN KEY("roleId") 
        REFERENCES role(id)
        ON DELETE SET NULL
    )
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP table users`);
}
