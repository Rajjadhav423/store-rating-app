const { Pool } = require('pg');
const env = require('./env');

const pool = env.databaseUrl
  ? new Pool({ connectionString: env.databaseUrl })
  : new Pool({
      host: env.dbHost,
      port: env.dbPort,
      user: env.dbUser,
      password: env.dbPassword,
      database: env.dbName,
    });

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
