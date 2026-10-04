const db = require('../config/db');
const AppError = require('../utils/appError');

async function upsertRating(userId, payload) {
  const store = await db.query('SELECT id FROM stores WHERE id = $1', [payload.storeId]);
  if (!store.rowCount) throw new AppError(404, 'Store not found');

  const result = await db.query(
    `INSERT INTO ratings (user_id, store_id, rating)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, store_id)
     DO UPDATE SET rating = EXCLUDED.rating, updated_at = NOW()
     RETURNING id, user_id, store_id, rating, created_at, updated_at`,
    [userId, payload.storeId, payload.rating]
  );

  return result.rows[0];
}

async function getUserRating(userId, storeId) {
  const result = await db.query(
    'SELECT id, user_id, store_id, rating, created_at, updated_at FROM ratings WHERE user_id = $1 AND store_id = $2',
    [userId, storeId]
  );

  return result.rows[0] || null;
}

async function getStoreRatings(storeId, requester) {
  if (requester.role === 'OWNER') {
    const ownership = await db.query('SELECT id FROM stores WHERE id = $1 AND owner_id = $2', [storeId, requester.id]);
    if (!ownership.rowCount) throw new AppError(403, 'Forbidden');
  }

  const result = await db.query(
    `SELECT r.id, r.rating, r.created_at, u.id AS user_id, u.name, u.email, u.address
     FROM ratings r
     INNER JOIN users u ON u.id = r.user_id
     WHERE r.store_id = $1
     ORDER BY r.created_at DESC`,
    [storeId]
  );

  return result.rows;
}

module.exports = { upsertRating, getUserRating, getStoreRatings };
