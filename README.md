# TaskFlow — Project Task Manager

## Tech Stack
- **Frontend:** React, Vite, React Hook Form, Zod, Axios, React Router
- **Backend:** Node.js, Express, PostgreSQL, JWT, bcrypt

## Project Structure
taskflow/
├── backend/
└── frontend/

## Setup Instructions

### Backend
cd backend
npm install
cp .env.example .env   # fill in your PostgreSQL credentials
npm run dev

### Frontend
cd frontend
npm install
npm run dev

## Features
- JWT Authentication (Register/Login)
- Project CRUD
- Task CRUD with status and priority
- Filter tasks by status, priority, search
- Protected routes
- Full validation on frontend and backend
- Loading and error states throughout

## API Endpoints
### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/auth/me

### Projects
- GET    /api/projects
- POST   /api/projects
- PUT    /api/projects/:id
- DELETE /api/projects/:id

### Tasks
- GET    /api/tasks?projectId=&status=&priority=
- POST   /api/tasks
- PUT    /api/tasks/:id
- DELETE /api/tasks/:id