import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE schedule (
      id BIGINT PRIMARY KEY DEFAULT (generate_id()),
      "userId" BIGINT NOT NULL,
      "tutorStudentId" BIGINT,
      description TEXT, 
      duration INT,
      "startTime" TIMESTAMP WITH TIME ZONE NOT NULL,
      "endTime" TIMESTAMP WITH TIME ZONE NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_user
        FOREIGN KEY("userId") 
        REFERENCES users(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_tutor_student_id
        FOREIGN KEY("tutorStudentId") 
        REFERENCES tutor_student(id)
        ON DELETE CASCADE 
    )
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP table schedule`);
}
