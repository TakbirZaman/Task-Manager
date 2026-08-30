const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { signToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const SALT_ROUNDS = 10;

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
  if (existing.rows.length > 0) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name.trim(), normalizedEmail, passwordHash]
  );

  const user = result.rows[0];
  const token = signToken({ id: user.id, email: user.email });

  res.status(201).json({ user, token });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  const result = await pool.query(
    'SELECT id, name, email, password_hash FROM users WHERE email = $1',
    [normalizedEmail]
  );
  const user = result.rows[0];

  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const token = signToken({ id: user.id, email: user.email });

  res.json({
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
});

const getMe = asyncHandler(async (req, res) => {
  const result = await pool.query(
    'SELECT id, name, email, created_at FROM users WHERE id = $1',
    [req.user.id]
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, 'User not found.');
  }

  res.json({ user: result.rows[0] });
});

module.exports = { register, login, getMe };
