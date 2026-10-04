function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  if (statusCode === 500) console.error(err); // eslint-disable-line no-console
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  res.status(statusCode).json({ message });
}

module.exports = errorHandler;
