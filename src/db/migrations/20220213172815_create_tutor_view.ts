import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  const tutorRatingBuilder = knex
    .table('tutor_rating')
    .select(
      knex.raw('count(id) as "totalRatings"'),
      knex.raw('COALESCE(AVG(rating)::numeric(10,1), 0) as "averageRating"'),
      'tutorId',
    )
    .groupBy('tutorId');

  await knex.raw(`
    CREATE VIEW tutor_view AS
      SELECT 
        tutor.*, 
        COALESCE(table_temp."totalRatings", 0) as "totalRatings", 
        COALESCE(table_temp."averageRating", 0) as "averageRating"   
      FROM tutor
      LEFT JOIN
      (
        ${tutorRatingBuilder.toQuery()}
      ) table_temp
      ON tutor."id" = table_temp."tutorId"
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP VIEW tutor_view
  `);
}
