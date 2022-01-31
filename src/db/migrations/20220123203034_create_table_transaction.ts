import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE transaction (
      id BIGINT PRIMARY KEY DEFAULT (generate_id()),
      "tutorUserId" BIGINT NOT NULL,
      "studentUserId" BIGINT NOT NULL,
      "subjectId" BIGINT NOT NULL,
      "price" INT NOT NULL,
      "payType" VARCHAR(255),
      "isPaid" BOOLEAN NOT NULL DEFAULT FALSE,
      "modifiedBy" BIGINT,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
      CONSTRAINT fk_tutor_user
        FOREIGN KEY("tutorUserId") 
        REFERENCES users(id)
        ON DELETE SET NULL,

      CONSTRAINT fk_student_user
        FOREIGN KEY("studentUserId") 
        REFERENCES users(id)
        ON DELETE SET NULL,

      CONSTRAINT fk_subject
        FOREIGN KEY("subjectId") 
        REFERENCES subject(id)
        ON DELETE SET NULL,

      CONSTRAINT fk_modified_by
        FOREIGN KEY("modifiedBy") 
        REFERENCES users(id)
        ON DELETE SET NULL
    )
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP table transaction`);
}
