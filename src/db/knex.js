
module.exports = {
  client: 'pg',
  connection: {
    ssl: { rejectUnauthorized: false },
    connectionString:
      'postgres://fbwnbzeecnnwna:f06cd67dad02846b6a7f8afa89524dc37783ed85e38768124c8306932f214698@ec2-52-71-241-37.compute-1.amazonaws.com:5432/ddqgap9bi1g6pc',
  },
  pool: {
    min: parseInt(process.env.DB_POOL_MIN) || 5,
    max: parseInt(process.env.DB_POOL_MAX) || 5,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: 'migrations',
  },
};

