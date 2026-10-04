const db = require('../config/db');
const { parsePagination, parseSort } = require('../utils/query');

const STORE_SORT_FIELDS = ['name', 'address', 'overallRating'];

async function listStoresForUser(query, userId) {
  const { page, limit, offset } = parsePagination(query);
  const { sortBy, sortOrder } = parseSort(query, STORE_SORT_FIELDS, 'name');

  const params = [userId, userId];
  const filters = [];
  const countParams = [];
  if (query.search) {
    const searchTerm = `%${query.search}%`;
    params.push(searchTerm, searchTerm);
    countParams.push(searchTerm, searchTerm);
    filters.push('(s.name LIKE ? OR s.address LIKE ?)');
  }

  const whereClause = filters.length ? `AND ${filters.join(' AND ')}` : '';
  const orderBy =
    sortBy === 'overallRating' ? `COALESCE(AVG(r.rating), 0) ${sortOrder}` : `s.${sortBy} ${sortOrder}`;

  params.push(limit, offset);

  const dataQuery = `
    SELECT s.id, s.name, s.address,
           ROUND(COALESCE(AVG(r.rating), 0), 2) AS overall_rating,
           COALESCE(MAX(CASE WHEN ur.user_id = ? THEN ur.rating END), 0) AS user_rating
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = ?
    WHERE 1=1 ${whereClause}
    GROUP BY s.id
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `;

  const countQuery = `SELECT COUNT(*) AS total FROM stores s WHERE 1=1 ${whereClause}`;

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

module.exports = { listStoresForUser };
