# TaskFlow – Full-Stack Task Management Application

> **React · Node/Express · MySQL · Tailwind CSS · MVC Architecture**

A production-ready task management app with full CRUD, search, status tracking, and a modern dark-UI dashboard.

---

## Table of Contents
1. [Project Structure](#project-structure)
2. [Technology Stack](#technology-stack)
3. [Prerequisites](#prerequisites)
4. [Database Setup](#database-setup)
5. [Backend Setup](#backend-setup)
6. [Frontend Setup](#frontend-setup)
7. [API Reference](#api-reference)
8. [Features](#features)
9. [Architecture](#architecture)

---

## Project Structure

```
task-manager/
├── database/
│   └── schema.sql              ← MySQL table DDL + seed data
│
├── backend/                    ← Node.js / Express API (MVC)
│   ├── config/
│   │   └── db.js               ← MySQL connection pool
│   ├── models/
│   │   └── taskModel.js        ← Raw SQL queries (Model layer)
│   ├── controllers/
│   │   └── taskController.js   ← Business logic (Controller layer)
│   ├── routes/
│   │   └── taskRoutes.js       ← Route definitions + validation
│   ├── .env.example            ← Environment variable template
│   ├── package.json
│   └── server.js               ← Express app entry point
│
└── frontend/                   ← React SPA (Vite + Tailwind)
    ├── src/
    │   ├── components/
    │   │   ├── TaskForm.jsx     ← Create / Edit form (controlled)
    │   │   ├── TaskTable.jsx    ← Task list table with actions
    │   │   ├── Modal.jsx        ← Reusable overlay dialog
    │   │   ├── SearchBar.jsx    ← Debounced search input
    │   │   └── StatsBar.jsx     ← Aggregate stats cards
    │   ├── hooks/
    │   │   └── useTasks.js      ← Custom hook (state + API calls)
    │   ├── services/
    │   │   └── taskService.js   ← Axios API wrapper
    │   ├── App.jsx              ← Root component / layout
    │   ├── main.jsx             ← React entry point
    │   └── index.css            ← Tailwind directives + custom CSS
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## Technology Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18, Vite, Tailwind CSS, Axios     |
| Backend  | Node.js 18+, Express 4, express-validator, morgan |
| Database | MySQL 8+, mysql2/promise (connection pool) |
| Dev Tools| Nodemon, date-fns, react-hot-toast      |

---

## Prerequisites

Make sure the following are installed:

- **Node.js** v18 or higher → [nodejs.org](https://nodejs.org)
- **npm** v9 or higher (bundled with Node.js)
- **MySQL** 8.0 or higher → [mysql.com](https://dev.mysql.com/downloads/)
- A MySQL client: MySQL Workbench, DBeaver, or the CLI

---

## Database Setup

### 1. Start MySQL and open a client

```bash
# macOS (Homebrew)
brew services start mysql
mysql -u root -p

# Windows (run MySQL CLI as admin)
# Linux
sudo systemctl start mysql
mysql -u root -p
```

### 2. Run the schema script

```bash
# From the project root:
mysql -u root -p < database/schema.sql
```

Or paste the contents of `database/schema.sql` into your MySQL client.

This will:
- Create the `task_manager_db` database
- Create the `tasks` table with all required columns
- Insert 7 example tasks

### Tasks Table Schema

```sql
CREATE TABLE tasks (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255)  NOT NULL,
  description TEXT,
  due_date    DATE,
  status      ENUM('Pending','Completed') NOT NULL DEFAULT 'Pending',
  remarks     TEXT,
  created_by  VARCHAR(100)  NOT NULL DEFAULT 'System',
  updated_by  VARCHAR(100)  NOT NULL DEFAULT 'System',
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## Backend Setup

### 1. Navigate to the backend folder

```bash
cd task-manager/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=task_manager_db

FRONTEND_ORIGIN=http://localhost:5173
```

### 4. Start the backend server

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

You should see:
```
✅  MySQL connected → task_manager_db@localhost
🚀  Server running on http://localhost:5000
📋  Tasks API  →  http://localhost:5000/api/tasks
```

### 5. Health check

```bash
curl http://localhost:5000/health
# → { "status": "OK", "timestamp": "..." }
```

---

## Frontend Setup

### 1. Navigate to the frontend folder

```bash
cd task-manager/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open your browser at **http://localhost:5173**

> The Vite dev server proxies `/api` requests to `http://localhost:5000` automatically — no CORS issues during development.

### 4. Build for production

```bash
npm run build
# Output: frontend/dist/
```

---

## API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint           | Description                      |
|--------|--------------------|----------------------------------|
| GET    | `/tasks`           | Retrieve all tasks               |
| GET    | `/tasks/search?q=` | Search tasks by title/description|
| GET    | `/tasks/:id`       | Get a single task                |
| POST   | `/tasks`           | Create a new task                |
| PUT    | `/tasks/:id`       | Update a task                    |
| DELETE | `/tasks/:id`       | Delete a task                    |

### POST /tasks – Request Body

```json
{
  "title":       "Fix login bug",
  "description": "OAuth callback returns 401 in production",
  "due_date":    "2025-04-15",
  "status":      "Pending",
  "remarks":     "Affects all social login providers",
  "created_by":  "Alice"
}
```

### Standard Response Envelope

```json
{
  "success": true,
  "message": "Task created successfully.",
  "data": { ...taskObject }
}
```

---

## Features

- ✅ **Create Task** – Modal form with validation
- ✅ **View Tasks** – Responsive table with hover actions
- ✅ **Edit Task** – Pre-populated modal form
- ✅ **Delete Task** – Confirmation prompt + instant removal
- ✅ **Search Tasks** – Debounced live search (title & description)
- ✅ **Status Badges** – Visual Pending / Completed indicators
- ✅ **Overdue Detection** – Highlights past-due tasks in red
- ✅ **Stats Dashboard** – Total, Completed, Pending, Overdue counts
- ✅ **Loading States** – Skeleton screens and spinners
- ✅ **Toast Notifications** – Success & error feedback
- ✅ **Responsive UI** – Works on mobile, tablet, and desktop

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  React Frontend                  │
│  App.jsx → useTasks (hook) → taskService (Axios) │
└────────────────────┬────────────────────────────┘
                     │ HTTP / JSON
┌────────────────────▼────────────────────────────┐
│              Express.js Backend (MVC)            │
│  Routes → Controllers → Models → MySQL Pool      │
└────────────────────┬────────────────────────────┘
                     │ mysql2/promise
┌────────────────────▼────────────────────────────┐
│               MySQL 8 Database                   │
│               task_manager_db.tasks              │
└─────────────────────────────────────────────────┘
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `ECONNREFUSED` on backend start | Ensure MySQL is running and `.env` credentials are correct |
| CORS errors in browser | Check `FRONTEND_ORIGIN` in `.env` matches your Vite port |
| `module not found` | Run `npm install` in both `backend/` and `frontend/` |
| Blank page in browser | Check browser console; ensure backend is running on port 5000 |
| Date not saving | Use `YYYY-MM-DD` format only |

---

*Built with the MVC pattern — Model handles data, Controller handles logic, Routes handle HTTP mapping.*
