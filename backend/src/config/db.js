// backend/src/config/db.js
// Single shared connection pool for the whole app. Every query goes
// through here so connections are reused instead of opened per-request.

const { Pool } = require('pg');

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
      }
    : {
        host: process.env.PGHOST,
        port: Number(process.env.PGPORT) || 5432,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        connectionTimeoutMillis: 10000,
      }
);

pool.on('error', (err) => {
  // Catches errors on idle clients (e.g. DB restarted) so a single bad
  // connection can't crash the whole process.
  console.error('Unexpected PostgreSQL pool error:', err.message);
});

module.exports = pool;
