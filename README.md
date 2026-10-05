# Task Manager

Simple full-stack todo with real auth. Each user only sees their own tasks.

What it does:
- Register / login (JWT + bcrypt)
- Create, edit, complete, delete tasks
- Filter by status / priority / search
- CSV export

Stack: React 19 + Vite, Node/Express, PostgreSQL

Run it:
```bash
docker compose up --build
# or run backend + frontend separately
cd backend && npm install && npm run dev
cd ../frontend && npm install && npm run dev
```
Live: https://task-manager-takbirzamans-projects.vercel.app/
