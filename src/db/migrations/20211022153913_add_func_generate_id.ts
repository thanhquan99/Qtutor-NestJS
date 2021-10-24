import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE SEQUENCE IF NOT EXISTS global_id_sequence;
    CREATE FUNCTION generate_id(OUT result bigint) AS $$
    DECLARE
        -- TO START IDS SMALLER, YOU COULD CHANGE THIS TO A MORE RECENT UNIX TIMESTAMP
        our_epoch bigint := 1483228800;

        seq_id bigint;
        now_millis bigint;
        -- UNIQUE SERVICE IDENTIFIER
        -- CHANGE THIS FOR EACH SERVICE!!!
        service_id int := 1;
    BEGIN
        SELECT nextval('global_id_sequence') % 1024 INTO seq_id;
        SELECT FLOOR(EXTRACT(EPOCH FROM clock_timestamp()) * 10) INTO now_millis;
        result := (now_millis - our_epoch) << 20;
        result := result | (service_id << 10);
        result := result | (seq_id);
    END;
    $$ LANGUAGE PLPGSQL;

    -- Assign as the default value for the id column on a table (e.g. mytable)
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP SEQUENCE global_id_sequence;
    DROP FUNCTION generate_id;
  `);
}
