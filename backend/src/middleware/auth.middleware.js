// backend/src/middleware/auth.middleware.js
// Protects routes by requiring a valid "Bearer <token>" Authorization header.
// On success, attaches { id, email } to req.user for downstream handlers.

const { verifyToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');

function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'No token provided. Please log in.'));
  }

  const token = header.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Session expired. Please log in again.'));
    }
    return next(new ApiError(401, 'Invalid token. Please log in again.'));
  }
}

module.exports = requireAuth;
