const bcrypt = require('bcryptjs');
const db = require('../config/db');
const env = require('../config/env');

async function seed() {
  const existing = await db.query('SELECT id FROM users WHERE email = $1', [env.adminEmail.toLowerCase()]);
  if (existing.rowCount === 0) {
    const passwordHash = await bcrypt.hash(env.adminPassword, 10);
    await db.query(
      `INSERT INTO users (name, email, password_hash, address, role)
       VALUES ($1, $2, $3, $4, 'ADMIN')`,
      [env.adminName, env.adminEmail.toLowerCase(), passwordHash, env.adminAddress]
    );
    // eslint-disable-next-line no-console
    console.log('Default admin created');
  } else {
    // eslint-disable-next-line no-console
    console.log('Default admin already exists');
  }
  await db.pool.end();
}

seed().catch(async (error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  await db.pool.end();
  process.exit(1);
});
