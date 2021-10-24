import knex from 'knex';
import config from './knex';

const knexInstance = knex(config);

export default knexInstance;
