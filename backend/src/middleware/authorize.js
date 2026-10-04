const AppError = require('../utils/appError');

function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(403, 'Forbidden'));
    }
    return next();
  };
}

module.exports = authorize;
