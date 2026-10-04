const mysql = require('mysql2/promise');
const env = require('./env');

const pool = env.databaseUrl
  ? mysql.createPool({ uri: env.databaseUrl, waitForConnections: true, connectionLimit: 10 })
  : mysql.createPool({
      host: env.dbHost,
      port: env.dbPort,
      user: env.dbUser,
      password: env.dbPassword,
      database: env.dbName,
      waitForConnections: true,
      connectionLimit: 10,
    });

// Returns { rows, rowCount, insertId } for any statement.
async function query(text, params = []) {
  const [result] = await pool.query(text, params);
  if (Array.isArray(result)) return { rows: result, rowCount: result.length, insertId: 0 };
  return { rows: [], rowCount: result.affectedRows, insertId: result.insertId };
}

module.exports = { query, pool };
