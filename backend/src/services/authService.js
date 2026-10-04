const bcrypt = require('bcryptjs');
const db = require('../config/db');
const AppError = require('../utils/appError');
const { signToken } = require('../utils/jwt');

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    role: user.role,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

async function register(payload) {
  const existing = await db.query('SELECT id FROM users WHERE email = $1', [payload.email]);
  if (existing.rowCount > 0) {
    throw new AppError(409, 'Email already exists');
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const result = await db.query(
    `INSERT INTO users (name, email, password_hash, address, role)
     VALUES ($1, $2, $3, $4, 'USER')
     RETURNING id, name, email, address, role, created_at, updated_at`,
    [payload.name, payload.email, passwordHash, payload.address]
  );

  const user = result.rows[0];
  const token = signToken({ id: user.id, role: user.role, email: user.email });

  return { user: sanitizeUser(user), token };
}

async function login(payload) {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [payload.email]);
  if (result.rowCount === 0) {
    throw new AppError(401, 'Invalid credentials');
  }

  const user = result.rows[0];
  const isPasswordValid = await bcrypt.compare(payload.password, user.password_hash);
  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid credentials');
  }

  const token = signToken({ id: user.id, role: user.role, email: user.email });
  return { user: sanitizeUser(user), token };
}

async function changePassword(userId, payload) {
  const result = await db.query('SELECT id, password_hash FROM users WHERE id = $1', [userId]);
  if (result.rowCount === 0) {
    throw new AppError(404, 'User not found');
  }

  const user = result.rows[0];
  const valid = await bcrypt.compare(payload.oldPassword, user.password_hash);
  if (!valid) {
    throw new AppError(400, 'Old password is incorrect');
  }

  const passwordHash = await bcrypt.hash(payload.newPassword, 10);
  await db.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [passwordHash, userId]);
}

module.exports = { register, login, changePassword, sanitizeUser };
