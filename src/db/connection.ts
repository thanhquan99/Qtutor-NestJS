import knex from 'knex';
import config from './knex';

const knexInstance = knex(config);

export default knexInstance;

// knexInstance.migrate
//   .rollback({
//     directory: 'src/db/migrations',
//     tableName: 'knex_migrations',
//   })
//   .then((result) => {
//     console.log(result);
//   });

// knexInstance.migrate
//   .latest({
//     directory: 'src/db/migrations',
//     tableName: 'knex_migrations',
//   })
//   .then((result) => {
//     console.log(result);
//   });
