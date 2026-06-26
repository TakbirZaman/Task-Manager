# Task Manager

A full-stack task manager built to demonstrate a complete, production-shaped pattern: a
**React** SPA talking to a **Node.js/Express** REST API, backed by **PostgreSQL**, with
**JWT authentication** and properly protected routes on both ends.

live link - https://task-manager-takbirzamans-projects.vercel.app/

## Features

- **Auth**: register / login with hashed passwords (bcrypt), JWT-based sessions
- **Protected routes**: both API routes (middleware) and frontend routes (redirect to `/login`)
- **Per-user data isolation**: every query is scoped to the logged-in user — verified so
  one account can never read, edit, or delete another account's tasks
- **Task CRUD**: create, edit, complete/uncomplete, delete
- **Filtering**: by status, priority, and free-text search
- **Sorting**: sort by created date, due date, priority, title, or status (ascending / descending)
- **Task statistics**: live counts for total, pending, in-progress, completed, and overdue tasks
- **CSV export**: download your task list (with active filters) as a CSV file
- **Input validation** on the server (`express-validator`) and friendly error states on the client
- **Security defaults**: `helmet`, CORS allow-list, rate limiting on auth endpoints,
  parameterized SQL (no string-built queries), generic error messages in production

## Tech stack

| Layer    | Choice |
|----------|--------|
| Frontend | React 19 + Vite, React Router, Tailwind CSS v4, Axios |
| Backend  | Node.js + Express, JWT, bcrypt, express-validator |
| Database | PostgreSQL (raw `pg`, parameterized SQL — no ORM magic to obscure what's happening)
- Dark mode (the token system in `index.css` makes this a matter of adding a second
  `@theme` palette)
