import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE student (
      id BIGINT PRIMARY KEY DEFAULT (generate_id()),
      "userId" BIGINT NOT NULL,
      "description" TEXT,
      "isPublished" BOOLEAN NOT NULL DEFAULT FALSE,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE("userId"),
    
      CONSTRAINT fk_users
        FOREIGN KEY("userId") 
        REFERENCES users(id)
        ON DELETE CASCADE
    )
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP table student`);
}
