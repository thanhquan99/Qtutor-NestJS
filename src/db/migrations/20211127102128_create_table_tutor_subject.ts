import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE tutor_subject (
      id BIGINT PRIMARY KEY DEFAULT (generate_id()),
      "tutorId" BIGINT NOT NULL,
      "subjectId" BIGINT NOT NULL,
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
  await knex.raw(`DROP table tutor_subject`);
}
