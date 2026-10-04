const db = require('../config/db');
const AppError = require('../utils/appError');

async function getOwnerDashboard(ownerId) {
  const storeResult = await db.query('SELECT id, name, email, address FROM stores WHERE owner_id = $1', [ownerId]);
  if (!storeResult.rowCount) throw new AppError(404, 'Store not found for owner');

  const store = storeResult.rows[0];
  const summary = await db.query(
    `SELECT COALESCE(AVG(rating), 0)::numeric(10,2) AS average_rating,
            COUNT(*)::int AS total_ratings
     FROM ratings
     WHERE store_id = $1`,
    [store.id]
  );

  const ratings = await db.query(
    `SELECT u.id AS user_id, u.name, u.email, u.address, r.rating, r.created_at
     FROM ratings r
     INNER JOIN users u ON u.id = r.user_id
     WHERE r.store_id = $1
     ORDER BY r.created_at DESC`,
    [store.id]
  );

  return {
    store,
    averageRating: summary.rows[0].average_rating,
    totalRatings: summary.rows[0].total_ratings,
    users: ratings.rows,
  };
}

module.exports = { getOwnerDashboard };
