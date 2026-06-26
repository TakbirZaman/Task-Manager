// backend/src/utils/asyncHandler.js
// Wraps an async route handler so any thrown/rejected error is forwarded
// to next(err) automatically instead of every controller needing try/catch.

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
