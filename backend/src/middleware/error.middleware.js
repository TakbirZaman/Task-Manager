// backend/src/middleware/error.middleware.js
// Single place that turns any thrown error into a JSON response.
// Operational errors (ApiError) keep their real message; anything
// unexpected is logged and replaced with a generic message so internals
// never leak to the client.

function notFound(req, res) {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
}

function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;

  if (!err.isOperational) {
    console.error('Unexpected error:', err);
  }

  res.status(statusCode).json({
    message: err.isOperational ? err.message : 'Something went wrong on our end.',
  });
}

module.exports = { notFound, errorHandler };
