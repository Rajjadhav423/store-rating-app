const AppError = require('./appError');

const SORT_DIRECTIONS = new Set(['asc', 'desc']);

function parsePagination(query) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  return { page, limit, offset: (page - 1) * limit };
}

function parseSort(query, whitelist, fallback) {
  const sortBy = query.sortBy && whitelist.includes(query.sortBy) ? query.sortBy : fallback;
  const sortOrder = (query.sortOrder || 'asc').toLowerCase();

  if (!SORT_DIRECTIONS.has(sortOrder)) {
    throw new AppError(400, 'Invalid sortOrder. Use asc or desc.');
  }

  return { sortBy, sortOrder };
}

module.exports = { parsePagination, parseSort };
