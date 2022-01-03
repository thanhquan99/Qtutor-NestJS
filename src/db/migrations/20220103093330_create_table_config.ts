import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE config (
      id BIGINT PRIMARY KEY DEFAULT (generate_id()),
      name VARCHAR(255) NOT NULL,
      key VARCHAR(255) NOT NULL,
      value TEXT,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await knex.table('config').insert({
    name: 'S3Token',
    key: 's3-token',
    value:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGtpbmRpY2FyZS5jb20iLCJpZCI6IjE1Mzk0MDkwMDIwNTA0NTgwIiwiZmlyc3ROYW1lIjoiS2luZGlDYXJlIiwibGFzdE5hbWUiOiJBZG1pbiIsImlzQWRtaW5XZWIiOnRydWUsInNjb3BlIjoic3VwZXJhZG1pbiIsInR0bCI6ODY0MDAwLCJpYXQiOjE2NDExMjI5MjQsImV4cCI6MTY0MTk4NjkyNH0.wxjdx9x0p0kgJGRqxZ4mBxgMgkgpmmFW4wm3v_t9Gfc',
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP table config`);
}
