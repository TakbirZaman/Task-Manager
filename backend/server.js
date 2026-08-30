require('dotenv').config();
const app = require('./src/app');
const pool = require('./src/config/db');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 5000;

async function setup() {
  const schemaPath = path.join(__dirname, 'src/db/schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  await pool.query(sql);
  console.log('Migration complete.');

  const users = [
    { name: 'Nahin', email: 'nahin@gmail.com', password: 'admin123' },
    { name: 'Takbir', email: 'takbir@gmail.com', password: 'admin123' },
  ];

  const sampleTasks = [
    { title: 'Complete project documentation', description: 'Write comprehensive docs for the Task Manager API', status: 'pending', priority: 'high', due_date: '2026-09-07' },
    { title: 'Review pull requests', description: 'Check and merge pending PRs on GitHub', status: 'in_progress', priority: 'medium', due_date: '2026-09-02' },
    { title: 'Set up CI/CD pipeline', description: 'Configure automated testing and deployment', status: 'pending', priority: 'high', due_date: '2026-09-10' },
    { title: 'Fix login page bug', description: 'Users report intermittent login failures on mobile', status: 'completed', priority: 'high', due_date: '2026-08-30' },
    { title: 'Update dependencies', description: 'Run npm audit fix and update outdated packages', status: 'pending', priority: 'low', due_date: null },
    { title: 'Design new dashboard', description: 'Create mockups for the analytics dashboard', status: 'in_progress', priority: 'medium', due_date: '2026-09-14' },
    { title: 'Write unit tests', description: 'Add test coverage for auth and task controllers', status: 'pending', priority: 'high', due_date: '2026-09-12' },
    { title: 'Optimize database queries', description: 'Add indexes and fix slow queries in task listing', status: 'pending', priority: 'medium', due_date: '2026-09-05' },
    { title: 'Deploy to production', description: 'Final testing and production deployment', status: 'completed', priority: 'high', due_date: '2026-08-31' },
    { title: 'Team standup meeting', description: 'Weekly sync with the development team', status: 'completed', priority: 'low', due_date: '2026-08-28' },
  ];

  for (const u of users) {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [u.email]);
    if (existing.rows.length > 0) continue;

    const hash = await bcrypt.hash(u.password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id`,
      [u.name, u.email, hash]
    );
    const userId = result.rows[0].id;

    const userTasks = u.email === 'nahin@gmail.com'
      ? sampleTasks.filter((_, i) => i % 2 === 0)
      : sampleTasks.filter((_, i) => i % 2 === 1);

    for (const t of userTasks) {
      await pool.query(
        `INSERT INTO tasks (user_id, title, description, status, priority, due_date)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, t.title, t.description, t.status, t.priority, t.due_date]
      );
    }
    console.log(`Seeded user ${u.email} with ${userTasks.length} tasks.`);
  }
}

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);

  setup()
    .then(() => console.log('Database setup complete.'))
    .catch((err) => {
      console.error('Database setup failed (server still running):', err.message);
    });
});
