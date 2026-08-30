const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', '..', 'data.db');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function query(sql, params = []) {
  const placeholders = [];
  let i = 0;
  const converted = sql.replace(/\$(\d+)/g, (_, num) => {
    placeholders.push(params[Number(num) - 1] ?? null);
    return '?';
  });

  const stmt = db.prepare(converted);
  const lower = converted.trim().toUpperCase();

  if (lower.startsWith('SELECT') || lower.startsWith('WITH')) {
    return { rows: stmt.all(...placeholders), rowCount: stmt.all(...placeholders).length };
  }

  if (lower.startsWith('INSERT') && converted.toUpperCase().includes('RETURNING')) {
    const insertSql = converted.replace(/RETURNING\s+.+$/i, '');
    const insertStmt = db.prepare(insertSql);
    const info = insertStmt.run(...placeholders);
    const selectStmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const row = selectStmt.get(info.lastInsertRowid);
    if (row) return { rows: [row], rowCount: 1 };
    return { rows: [{ id: info.lastInsertRowid }], rowCount: 1 };
  }

  const info = stmt.run(...placeholders);
  return { rows: [], rowCount: info.changes };
}

function close() {
  db.close();
}

module.exports = { query, close, db };
