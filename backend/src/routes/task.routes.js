// backend/src/routes/task.routes.js

const express = require('express');
const { body, param, query } = require('express-validator');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getStats,
  exportTasks,
} = require('../controllers/task.controller');
const validate = require('../middleware/validate.middleware');
const requireAuth = require('../middleware/auth.middleware');

const router = express.Router();

const STATUS_VALUES = ['pending', 'in_progress', 'completed'];
const PRIORITY_VALUES = ['low', 'medium', 'high'];
const SORT_FIELDS = ['created_at', 'due_date', 'priority', 'title', 'status'];
const SORT_ORDERS = ['asc', 'desc'];

// Every route below requires a valid JWT.
router.use(requireAuth);

router.get(
  '/',
  [
    query('status').optional().isIn(STATUS_VALUES),
    query('priority').optional().isIn(PRIORITY_VALUES),
    query('sort_by').optional().isIn(SORT_FIELDS),
    query('sort_order').optional().isIn(SORT_ORDERS),
  ],
  validate,
  getTasks
);

router.get('/stats', getStats);

router.get('/export', exportTasks);

router.get('/:id', [param('id').isInt().withMessage('Invalid task id.')], validate, getTaskById);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required.').isLength({ max: 200 }),
    body('description').optional({ nullable: true }).isString(),
    body('status').optional().isIn(STATUS_VALUES),
    body('priority').optional().isIn(PRIORITY_VALUES),
    body('due_date').optional({ nullable: true }).isISO8601().withMessage('due_date must be a valid date.'),
  ],
  validate,
  createTask
);

router.patch(
  '/:id',
  [
    param('id').isInt().withMessage('Invalid task id.'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty.').isLength({ max: 200 }),
    body('description').optional({ nullable: true }).isString(),
    body('status').optional().isIn(STATUS_VALUES),
    body('priority').optional().isIn(PRIORITY_VALUES),
    body('due_date').optional({ nullable: true }).isISO8601().withMessage('due_date must be a valid date.'),
  ],
  validate,
  updateTask
);

router.delete('/:id', [param('id').isInt().withMessage('Invalid task id.')], validate, deleteTask);

module.exports = router;
