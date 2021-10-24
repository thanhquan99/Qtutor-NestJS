import { Model } from 'objection';
import knexPostgis from 'knex-postgis';
import knex from '../connection';

// knex.on('query', function (queryData) {
//   console.log(queryData);
// });

Model.knex(knex);

const st = knexPostgis(knex);

export { Model, st, knex };
