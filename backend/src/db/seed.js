const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const SALT_ROUNDS = 10;

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

async function seed() {
  try {
    console.log('Seeding database...');

    for (const u of users) {
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [u.email]);
      if (existing.rows.length > 0) {
        console.log(`  User ${u.email} already exists, skipping.`);
        continue;
      }

      const hash = await bcrypt.hash(u.password, SALT_ROUNDS);
      const result = await pool.query(
        `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id`,
        [u.name, u.email, hash]
      );
      const userId = result.rows[0].id;
      console.log(`  Created user: ${u.email} (id: ${userId})`);

      const userTasks = sampleTasks.filter((_, i) => i % users.length === users.indexOf(u));
      for (const t of userTasks) {
        await pool.query(
          `INSERT INTO tasks (user_id, title, description, status, priority, due_date)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [userId, t.title, t.description, t.status, t.priority, t.due_date]
        );
      }
      console.log(`  Added ${userTasks.length} tasks for ${u.email}`);
    }

    console.log('Seeding complete.');
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();
