// backend/src/controllers/task.controller.js
// Every query is scoped to req.user.id (set by the auth middleware) so one
// user can never read, edit, or delete another user's tasks.

const pool = require('../config/db');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const SORTABLE_FIELDS = {
  created_at: 'created_at',
  due_date: 'due_date',
  priority: "CASE priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END",
  title: 'title',
  status: "CASE status WHEN 'pending' THEN 0 WHEN 'in_progress' THEN 1 ELSE 2 END",
};

const STATUS_VALUES = ['pending', 'in_progress', 'completed'];

// GET /api/tasks?status=pending&priority=high&search=report&sort_by=created_at&sort_order=desc
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
    conditions.push(`title ILIKE $${values.length}`);
  }

  const orderColumn = SORTABLE_FIELDS[sort_by] || 'created_at';
  const orderDir = sort_order === 'asc' ? 'ASC' : 'DESC';

  const query = `
    SELECT id, title, description, status, priority, due_date, created_at, updated_at
    FROM tasks
    WHERE ${conditions.join(' AND ')}
    ORDER BY ${orderColumn} ${orderDir}, created_at DESC
  `;

  const result = await pool.query(query, values);
  res.json({ tasks: result.rows });
});

// GET /api/tasks/:id
const getTaskById = asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT id, title, description, status, priority, due_date, created_at, updated_at
     FROM tasks WHERE id = $1 AND user_id = $2`,
    [req.params.id, req.user.id]
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, 'Task not found.');
  }

  res.json({ task: result.rows[0] });
});

// POST /api/tasks
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, due_date } = req.body;

  const result = await pool.query(
    `INSERT INTO tasks (user_id, title, description, status, priority, due_date)
     VALUES ($1, $2, $3, COALESCE($4, 'pending'), COALESCE($5, 'medium'), $6)
     RETURNING id, title, description, status, priority, due_date, created_at, updated_at`,
    [req.user.id, title.trim(), description || null, status, priority, due_date || null]
  );

  res.status(201).json({ task: result.rows[0] });
});

// PATCH /api/tasks/:id
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, due_date } = req.body;

  // Build the SET clause dynamically so a partial body (e.g. just
  // { status: 'completed' }) only touches the fields actually sent.
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

  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    throw new ApiError(404, 'Task not found.');
  }

  res.json({ task: result.rows[0] });
});

// DELETE /api/tasks/:id
const deleteTask = asyncHandler(async (req, res) => {
  const result = await pool.query(
    'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
    [req.params.id, req.user.id]
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, 'Task not found.');
  }

  res.status(204).send();
});

// GET /api/tasks/stats
const getStats = asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT
       COUNT(*)::int                                           AS total,
       COUNT(*) FILTER (WHERE status = 'pending')::int         AS pending,
       COUNT(*) FILTER (WHERE status = 'in_progress')::int     AS in_progress,
       COUNT(*) FILTER (WHERE status = 'completed')::int       AS completed,
       COUNT(*) FILTER (
         WHERE status != 'completed' AND due_date < CURRENT_DATE
       )::int                                                  AS overdue
     FROM tasks
     WHERE user_id = $1`,
    [req.user.id]
  );

  res.json({ stats: result.rows[0] });
});

// GET /api/tasks/export?status=&priority=&search=
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
    conditions.push(`title ILIKE $${values.length}`);
  }

  const query = `
    SELECT title, description, status, priority, due_date, created_at, updated_at
    FROM tasks
    WHERE ${conditions.join(' AND ')}
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query, values);
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
