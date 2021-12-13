import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE teaching_price (
      id BIGINT PRIMARY KEY DEFAULT (generate_id()),
      "tutorId" BIGINT NOT NULL,
      "subjectId" BIGINT NOT NULL, 
      "sessionsOfWeek" INT,
      price BIGINT,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_tutor
        FOREIGN KEY("tutorId") 
        REFERENCES tutor(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_subject
        FOREIGN KEY("subjectId") 
        REFERENCES subject(id)
        ON DELETE CASCADE
    )
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP table teaching_price`);
}
