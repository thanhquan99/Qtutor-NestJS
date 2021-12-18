import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE notification (
      id BIGINT PRIMARY KEY DEFAULT (generate_id()),
      "senderId" BIGINT NOT NULL,
      "userId" BIGINT NOT NULL,
      "extraId" BIGINT,
      message TEXT, 
      "isRead" BOOLEAN NOT NULL DEFAULT FALSE,
      type VARCHAR(255),
      "extraType" VARCHAR(255),
      url TEXT,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_sender
        FOREIGN KEY("senderId") 
        REFERENCES users(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_user
        FOREIGN KEY("userId") 
        REFERENCES users(id)
        ON DELETE CASCADE
    )
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP table notification`);
}
