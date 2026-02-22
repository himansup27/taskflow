# TaskFlow — Project Task Manager

A full-stack project and task management application built with React and Node.js.

---

## Tech Stack

### Frontend
- React 18 (Vite)
- React Router DOM v6
- React Hook Form + Zod (validation)
- Axios (API calls)
- CSS Modules

### Backend
- Node.js + Express.js
- PostgreSQL (pg)
- JWT (jsonwebtoken)
- bcryptjs
- express-validator

---

## Features

- JWT Authentication (Register & Login)
- Dashboard with all projects
- View project details with task list
- Create, Update, Delete Projects
- Create, Update, Delete Tasks
- Filter tasks by Status and Priority
- Search tasks by name
- Due date with Overdue detection
- Progress bar per project
- Protected routes (auth guard)
- Full validation on frontend and backend
- Loading and error states throughout
- Responsive layout (mobile + desktop)

---

## Project Structure

```
taskflow/
├── backend/
│   ├── config/
│   │   └── db.js                  # PostgreSQL connection + table creation
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification
│   │   ├── errorMiddleware.js      # Global error handler
│   │   └── validateMiddleware.js   # express-validator runner
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── apiResponse.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/                    # API abstraction layer
    │   │   ├── axiosInstance.js
    │   │   ├── auth.js
    │   │   ├── projects.js
    │   │   └── tasks.js
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Badge.jsx
    │   │   │   ├── ConfirmDialog.jsx
    │   │   │   ├── ProjectCard.jsx
    │   │   │   ├── ProjectFormModal.jsx
    │   │   │   ├── ProtectedRoute.jsx
    │   │   │   ├── TaskCard.jsx
    │   │   │   └── TaskFormModal.jsx
    │   │   └── layout/
    │   │       ├── AppLayout.jsx
    │   │       └── Sidebar.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx     # Global auth state (useReducer)
    │   ├── hooks/
    │   │   ├── useProjects.js
    │   │   └── useTasks.js
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   └── ProjectDetailPage.jsx
    │   ├── styles/
    │   │   └── global.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL 14+

---

### 1. Clone the repository

```bash
git clone https://github.com/himansup27/taskflow.git
cd taskflow
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Fill in your PostgreSQL credentials in `.env`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_manager
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Create the database in PostgreSQL:

```sql
CREATE DATABASE task_manager;
```

> Tables are created automatically on first server start — no migrations needed.

Start the backend server:

```bash
npm run dev
```

Server runs on **http://localhost:5000**

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:3000**

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | Login user | Public |
| GET | /api/auth/me | Get current user | Private |

### Projects
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/projects | Get all projects | Private |
| POST | /api/projects | Create project | Private |
| GET | /api/projects/:id | Get project by ID | Private |
| PUT | /api/projects/:id | Update project | Private |
| DELETE | /api/projects/:id | Delete project | Private |

### Tasks
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/tasks?projectId= | Get tasks (with filters) | Private |
| POST | /api/tasks | Create task | Private |
| GET | /api/tasks/:id | Get task by ID | Private |
| PUT | /api/tasks/:id | Update task | Private |
| DELETE | /api/tasks/:id | Delete task | Private |

#### Task Filter Query Params
```
GET /api/tasks?projectId=xxx&status=todo&priority=high&search=design
```

---

## Environment Variables

### Backend `.env`

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| DB_HOST | PostgreSQL host | localhost |
| DB_PORT | PostgreSQL port | 5432 |
| DB_NAME | Database name | task_manager |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | yourpassword |
| JWT_SECRET | JWT signing secret | anyrandomstring |
| JWT_EXPIRE | JWT expiry duration | 7d |
| NODE_ENV | Environment | development |
| CLIENT_URL | Frontend URL for CORS | http://localhost:3000 |

---

## Author

**Himansu** — [github.com/himansup27](https://github.com/himansup27)