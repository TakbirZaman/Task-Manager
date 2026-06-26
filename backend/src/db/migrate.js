// backend/src/db/migrate.js
// Applies schema.sql against the configured database.
// Usage: npm run migrate

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const pool = require('../config/db');

async function migrate() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  try {
    await pool.query(sql);
    console.log('Migration complete: users & tasks tables are ready.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

migrate();
