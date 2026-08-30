const db = require('../config/db');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const SORTABLE_FIELDS = {
  created_at: 'created_at',
  due_date: 'due_date',
  priority: "CASE priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END",
  title: 'title',
  status: "CASE status WHEN 'pending' THEN 0 WHEN 'in_progress' THEN 1 ELSE 2 END",
};

const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, search, sort_by, sort_order } = req.query;

  const conditions = ['user_id = $1'];
  const values = [req.user.id];

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  if (priority) {
    values.push(priority);
    conditions.push(`priority = $${values.length}`);
  }

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`title LIKE $${values.length}`);
  }

  const orderColumn = SORTABLE_FIELDS[sort_by] || 'created_at';
  const orderDir = sort_order === 'asc' ? 'ASC' : 'DESC';

  const query = `
    SELECT id, title, description, status, priority, due_date, created_at, updated_at
    FROM tasks
    WHERE ${conditions.join(' AND ')}
    ORDER BY ${orderColumn} ${orderDir}, created_at DESC
  `;

  const result = db.query(query, values);
  res.json({ tasks: result.rows });
});

const getTaskById = asyncHandler(async (req, res) => {
  const result = db.query(
    `SELECT id, title, description, status, priority, due_date, created_at, updated_at
     FROM tasks WHERE id = $1 AND user_id = $2`,
    [req.params.id, req.user.id]
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, 'Task not found.');
  }

  res.json({ task: result.rows[0] });
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, due_date } = req.body;

  const result = db.query(
    `INSERT INTO tasks (user_id, title, description, status, priority, due_date)
     VALUES ($1, $2, $3, COALESCE($4, 'pending'), COALESCE($5, 'medium'), $6)
     RETURNING id, title, description, status, priority, due_date, created_at, updated_at`,
    [req.user.id, title.trim(), description || null, status, priority, due_date || null]
  );

  res.status(201).json({ task: result.rows[0] });
});

const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, due_date } = req.body;

  const fields = [];
  const values = [];

  const setField = (column, value) => {
    if (value !== undefined) {
      values.push(value);
      fields.push(`${column} = $${values.length}`);
    }
  };

  setField('title', title?.trim());
  setField('description', description);
  setField('status', status);
  setField('priority', priority);
  setField('due_date', due_date);

  if (fields.length === 0) {
    throw new ApiError(400, 'No fields provided to update.');
  }

  values.push(req.params.id, req.user.id);

  const query = `
    UPDATE tasks
    SET ${fields.join(', ')}
    WHERE id = $${values.length - 1} AND user_id = $${values.length}
    RETURNING id, title, description, status, priority, due_date, created_at, updated_at
  `;

  const result = db.query(query, values);

  if (result.rows.length === 0) {
    throw new ApiError(404, 'Task not found.');
  }

  res.json({ task: result.rows[0] });
});

const deleteTask = asyncHandler(async (req, res) => {
  const result = db.query(
    'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
    [req.params.id, req.user.id]
  );

  if (result.rowCount === 0) {
    throw new ApiError(404, 'Task not found.');
  }

  res.status(204).send();
});

const getStats = asyncHandler(async (req, res) => {
  const total = db.query('SELECT COUNT(*) as total FROM tasks WHERE user_id = $1', [req.user.id]);
  const pending = db.query("SELECT COUNT(*) as count FROM tasks WHERE user_id = $1 AND status = 'pending'", [req.user.id]);
  const inProgress = db.query("SELECT COUNT(*) as count FROM tasks WHERE user_id = $1 AND status = 'in_progress'", [req.user.id]);
  const completed = db.query("SELECT COUNT(*) as count FROM tasks WHERE user_id = $1 AND status = 'completed'", [req.user.id]);
  const overdue = db.query("SELECT COUNT(*) as count FROM tasks WHERE user_id = $1 AND status != 'completed' AND due_date < date('now')", [req.user.id]);

  res.json({
    stats: {
      total: total.rows[0].total,
      pending: pending.rows[0].count,
      in_progress: inProgress.rows[0].count,
      completed: completed.rows[0].count,
      overdue: overdue.rows[0].count,
    },
  });
});

const exportTasks = asyncHandler(async (req, res) => {
  const { status, priority, search } = req.query;

  const conditions = ['user_id = $1'];
  const values = [req.user.id];

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  if (priority) {
    values.push(priority);
    conditions.push(`priority = $${values.length}`);
  }

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`title LIKE $${values.length}`);
  }

  const query = `
    SELECT title, description, status, priority, due_date, created_at, updated_at
    FROM tasks
    WHERE ${conditions.join(' AND ')}
    ORDER BY created_at DESC
  `;

  const result = db.query(query, values);
  const tasks = result.rows;

  const header = 'title,status,priority,due_date,created_at\n';
  const rows = tasks
    .map((t) =>
      [
        `"${(t.title || '').replace(/"/g, '""')}"`,
        t.status,
        t.priority,
        t.due_date || '',
        t.created_at,
      ].join(',')
    )
    .join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="tasks.csv"');
  res.send(header + rows);
});

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask, getStats, exportTasks };
