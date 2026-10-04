const AppError = require('../utils/appError');
const { verifyToken } = require('../utils/jwt');

function authenticate(req, _res, next) {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AppError(401, 'Authentication required'));
  }

  const token = authorization.slice(7);
  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return next(new AppError(401, 'Invalid or expired token'));
  }
}

module.exports = authenticate;
