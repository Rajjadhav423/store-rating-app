const mysql = require('mysql2/promise');
const db = require('../config/db');
const env = require('../config/env');

const statements = [
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL CHECK (char_length(name) BETWEEN 20 AND 60),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    address VARCHAR(400) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'USER', 'OWNER')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL CHECK (char_length(name) BETWEEN 20 AND 60),
    email VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(400) NOT NULL,
    owner_id INT NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_stores_name (name),
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE RESTRICT
  )`,
  `CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_store_rating UNIQUE (user_id, store_id),
    INDEX idx_ratings_store_id (store_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
  )`,
];

async function ensureDatabase() {
  // Create the target database if it doesn't exist yet (needs CREATE privilege).
  const target = env.databaseUrl ? new URL(env.databaseUrl) : null;
  const dbName = target ? decodeURIComponent(target.pathname.slice(1)) : env.dbName;
  const conn = await mysql.createConnection(
    target
      ? { host: target.hostname, port: Number(target.port || 3306), user: decodeURIComponent(target.username), password: decodeURIComponent(target.password) }
      : { host: env.dbHost, port: env.dbPort, user: env.dbUser, password: env.dbPassword }
  );
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await conn.end();
}

async function migrate() {
  await ensureDatabase();
  for (const statement of statements) {
    await db.query(statement);
  }
  // eslint-disable-next-line no-console
  console.log('Migration completed');
  await db.pool.end();
}

migrate().catch(async (error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  await db.pool.end();
  process.exit(1);
});
