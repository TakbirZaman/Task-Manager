// backend/src/middleware/validate.middleware.js
// Runs after an array of express-validator checks. If any failed, it
// collects the messages and short-circuits with a 400 instead of letting
// bad input reach the controller.

const { validationResult } = require('express-validator');

function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  next();
}

module.exports = validate;
