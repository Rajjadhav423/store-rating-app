const bcrypt = require('bcryptjs');
const db = require('../config/db');
const AppError = require('../utils/appError');
const { parsePagination, parseSort } = require('../utils/query');

const USER_SORT_FIELDS = ['name', 'email', 'address', 'role'];
const STORE_SORT_FIELDS = ['name', 'email', 'address', 'overallRating'];

async function dashboardStats() {
  const [users, stores, ratings] = await Promise.all([
    db.query('SELECT COUNT(*)::int AS count FROM users'),
    db.query('SELECT COUNT(*)::int AS count FROM stores'),
    db.query('SELECT COUNT(*)::int AS count FROM ratings'),
  ]);

  return {
    totalUsers: users.rows[0].count,
    totalStores: stores.rows[0].count,
    totalRatings: ratings.rows[0].count,
  };
}

async function createUser(payload) {
  const existing = await db.query('SELECT id FROM users WHERE email = $1', [payload.email]);
  if (existing.rowCount) throw new AppError(409, 'Email already exists');

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const result = await db.query(
    `INSERT INTO users (name, email, password_hash, address, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, address, role, created_at, updated_at`,
    [payload.name, payload.email, passwordHash, payload.address, payload.role]
  );

  return result.rows[0];
}

async function listUsers(query) {
  const { page, limit, offset } = parsePagination(query);
  const { sortBy, sortOrder } = parseSort(query, USER_SORT_FIELDS, 'name');

  const filters = [];
  const params = [];

  ['name', 'email', 'address', 'role'].forEach((field) => {
    if (query[field]) {
      params.push(`%${query[field]}%`);
      filters.push(`${field} ILIKE $${params.length}`);
    }
  });

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  params.push(limit, offset);

  const dataQuery = `
    SELECT id, name, email, address, role, created_at, updated_at
    FROM users
    ${whereClause}
    ORDER BY ${sortBy} ${sortOrder}
    LIMIT $${params.length - 1} OFFSET $${params.length}
  `;

  const countQuery = `SELECT COUNT(*)::int AS total FROM users ${whereClause}`;
  const countParams = params.slice(0, params.length - 2);

  const [dataResult, countResult] = await Promise.all([
    db.query(dataQuery, params),
    db.query(countQuery, countParams),
  ]);

  return {
    items: dataResult.rows,
    pagination: {
      page,
      limit,
      total: countResult.rows[0].total,
    },
  };
}

async function getUserById(userId) {
  const userResult = await db.query(
    'SELECT id, name, email, address, role, created_at, updated_at FROM users WHERE id = $1',
    [userId]
  );
  if (!userResult.rowCount) throw new AppError(404, 'User not found');

  const user = userResult.rows[0];
  if (user.role !== 'OWNER') return { user };

  const storeResult = await db.query(
    `SELECT s.id, s.name, s.email, s.address,
            COALESCE(AVG(r.rating), 0)::numeric(10,2) AS average_rating,
            COUNT(r.id)::int AS total_ratings
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE s.owner_id = $1
     GROUP BY s.id`,
    [userId]
  );

  return { user, stores: storeResult.rows };
}

async function createStore(payload) {
  const owner = await db.query('SELECT id, role FROM users WHERE id = $1', [payload.ownerId]);
  if (!owner.rowCount || owner.rows[0].role !== 'OWNER') {
    throw new AppError(400, 'ownerId must belong to a store owner');
  }

  const existing = await db.query('SELECT id FROM stores WHERE owner_id = $1', [payload.ownerId]);
  if (existing.rowCount > 0) {
    throw new AppError(400, 'Store owner already has a store');
  }

  const result = await db.query(
    `INSERT INTO stores (name, email, address, owner_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, address, owner_id, created_at, updated_at`,
    [payload.name, payload.email, payload.address, payload.ownerId]
  );

  return result.rows[0];
}

async function listStores(query) {
  const { page, limit, offset } = parsePagination(query);
  const { sortBy, sortOrder } = parseSort(query, STORE_SORT_FIELDS, 'name');

  const filters = [];
  const params = [];

  if (query.search) {
    params.push(`%${query.search}%`);
    filters.push(`(s.name ILIKE $${params.length} OR s.address ILIKE $${params.length} OR s.email ILIKE $${params.length})`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  const orderBy =
    sortBy === 'overallRating'
      ? `COALESCE(AVG(r.rating), 0) ${sortOrder}`
      : `s.${sortBy} ${sortOrder}`;

  params.push(limit, offset);

  const dataQuery = `
    SELECT s.id, s.name, s.email, s.address, s.owner_id,
           COALESCE(AVG(r.rating), 0)::numeric(10,2) AS overall_rating,
           COUNT(r.id)::int AS total_ratings
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    ${whereClause}
    GROUP BY s.id
    ORDER BY ${orderBy}
    LIMIT $${params.length - 1} OFFSET $${params.length}
  `;

  const countQuery = `SELECT COUNT(*)::int AS total FROM stores s ${whereClause}`;
  const countParams = params.slice(0, params.length - 2);

  const [dataResult, countResult] = await Promise.all([
    db.query(dataQuery, params),
    db.query(countQuery, countParams),
  ]);

  return {
    items: dataResult.rows,
    pagination: {
      page,
      limit,
      total: countResult.rows[0].total,
    },
  };
}

module.exports = { dashboardStats, createUser, listUsers, getUserById, createStore, listStores };
