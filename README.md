# ASVAA IT — School Management Portal

A full-stack school management portal built with **Vite + React** (frontend), **Node.js + Express** (backend API), and **MongoDB** (database).

## Features

- **School onboarding**: create your school by name first — this automatically provisions a dedicated MongoDB database for that school and issues a short school code (e.g. `GREENWOOD-4821`)
- **Multi-tenant by design**: every school's students, teachers, classes, attendance, fees and users live in their own isolated database; nothing is shared between schools except the lightweight school registry
- JWT authentication with roles: `admin`, `teacher`, `student`, `parent` — login/registration require the school code so the correct tenant database is used
- Student records (admission, class assignment, guardian details)
- Teacher records (employee ID, subjects, qualifications)
- Class / section management with class teacher assignment
- Daily attendance marking per class, with per-student summaries
- Fee tracking with partial payments and status (pending / partial / paid / overdue)
- School notice board with pinning and audience targeting
- **Printable ID cards with QR codes** for students and teachers, generated instantly after creation (or on demand from the Students/Teachers list) — the QR code encodes the school code, ID number, and name for quick scanning/verification
- **AI chatbot assistant** (powered by SambaNova Cloud), floating on every page:
  - **Logged out**: a scoped FAQ helper that only knows the school's public info (name, address, contact) and how the portal works — it cannot see or invent any student/staff data.
  - **Logged in**: a tool-calling assistant that can look up this school's own live data on request — student search, attendance summaries, fee status, overdue fees, and recent notices — by calling backend functions rather than guessing.
- Clean navy & gold dashboard UI, responsive down to mobile

## How the multi-tenant setup works

1. **`POST /api/schools`** — the very first step. Takes just a school name (plus optional address/contact info), generates a unique school code and a dedicated database name, and stores that mapping in a small **master database** (`asvaa_master`).
2. **`POST /api/auth/register`** and **`POST /api/auth/login`** — both require a `schoolCode` in the request body. The server looks up that code in the master database, then opens (or reuses a cached) connection to that specific school's database before creating/checking the user.
3. **Every authenticated request** — the JWT issued at login embeds the school's ID. The `protect` middleware reads that, looks up the school, and attaches `req.tenantModels` (Student, Teacher, ClassRoom, Attendance, Fee, Notice, User) bound to that school's own database. Controllers never talk to a hardcoded model — they always use whatever tenant the current request belongs to.

This means two schools can have staff with the same email address, identical admission numbers, or classes named "Grade 8 - A" without ever colliding — they're physically separate databases under the hood, unified only by the school code you use to sign in.

## Tech stack

| Layer     | Technology                              |
|-----------|------------------------------------------|
| Frontend  | Vite, React 18, React Router, Tailwind CSS, Axios |
| Backend   | Node.js, Express, JWT, bcryptjs          |
| Database  | MongoDB + Mongoose                       |

## Project structure

```
asvaa-school-portal/
├── backend/
│   ├── config/
│   │   ├── db.js                  # connects the MASTER database (school registry)
│   │   └── tenantManager.js       # opens/caches a connection per school database
│   ├── schemas/                   # Mongoose schemas (tenant-agnostic, compiled per-connection)
│   ├── models/School.js           # the only model on the master connection
│   ├── middleware/
│   │   ├── auth.js                # verifies JWT, resolves tenant from schoolId
│   │   ├── tenant.js              # resolves tenant from schoolCode (register/login)
│   │   └── errorHandler.js
│   ├── controllers/                # route handlers, all tenant-aware via req.tenantModels
│   ├── routes/                     # Express routers
│   ├── server.js                   # app entry point
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/axios.js           # API client + auth interceptor
    │   ├── context/AuthContext.jsx
    │   ├── components/            # Sidebar, Navbar, Layout, ProtectedRoute
    │   ├── pages/                 # CreateSchool, Login, Register, Dashboard, Students, Teachers, Classes, Attendance, Fees, Notices
    │   └── App.jsx
    └── .env.example
```

## Getting started

### Prerequisites

- Node.js 18+
- A MongoDB instance (local install or a free MongoDB Atlas cluster) — set `MONGO_URI` to the **base** connection string, without a database name at the end (e.g. `mongodb://127.0.0.1:27017` or `mongodb+srv://user:pass@cluster.mongodb.net`). The app appends database names itself (`asvaa_master` for the registry, and a generated name per school).

### 1. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env and set MONGO_URI + JWT_SECRET
npm install
npm run dev        # starts on http://localhost:6000
```

### 2. Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev         # starts on http://localhost:5175, proxies /api to :6000
```

### 3. Set up your school and create your first account

Open `http://localhost:5175` — you'll land on **Create your school**. Enter a school name and submit; you'll get back a school code (e.g. `GREENWOOD-4821`). Keep that code — you'll use it to register and to log in. From there, continue to **Create your admin account**, then sign in and start adding classes, teachers, and students.

## API overview

All endpoints are prefixed with `/api`. `/schools` and `/auth/register` + `/auth/login` are public; everything else requires an `Authorization: Bearer <token>` header.

| Method | Endpoint                          | Description                        | Roles                |
|--------|------------------------------------|-------------------------------------|-----------------------|
| POST   | `/schools`                        | Create a school (provisions its own database) | public   |
| GET    | `/schools/lookup/:code`           | Look up a school's name by its code | public                |
| POST   | `/auth/register`                  | Create an account (requires `schoolCode` in body) | public  |
| POST   | `/auth/login`                     | Log in (requires `schoolCode` in body), receive JWT | public |
| GET    | `/auth/me`                        | Current user profile                | any authenticated     |
| GET    | `/students`                       | List / search students              | any authenticated     |
| POST   | `/students`                       | Create a student                    | admin, teacher        |
| PUT    | `/students/:id`                   | Update a student                    | admin, teacher        |
| DELETE | `/students/:id`                   | Remove a student                    | admin                 |
| GET    | `/teachers`                       | List teachers                       | any authenticated     |
| POST   | `/teachers`                       | Create a teacher                    | admin                 |
| GET    | `/classes`                        | List classes                        | any authenticated     |
| POST   | `/classes`                        | Create a class                      | admin                 |
| POST   | `/attendance`                     | Bulk-mark attendance                | admin, teacher        |
| GET    | `/attendance`                     | Query attendance records            | any authenticated     |
| GET    | `/attendance/summary/:studentId`  | Attendance % for a student          | any authenticated     |
| GET    | `/fees`                           | List fee records                    | any authenticated     |
| POST   | `/fees`                           | Create a fee record                 | admin                 |
| POST   | `/fees/:id/pay`                   | Record a payment                    | admin                 |
| GET    | `/notices`                        | List notices                        | any authenticated     |
| POST   | `/notices`                        | Post a notice                       | admin, teacher        |
| POST   | `/chat/public`                    | Public FAQ chat (requires `schoolCode` in body) | public     |
| POST   | `/chat/staff`                     | Staff assistant chat, with live-data tool access | any authenticated |

## Setting up the AI chatbot

The chatbot uses [SambaNova Cloud](https://cloud.sambanova.ai)'s OpenAI-compatible API. To enable it:

1. Get an API key from `cloud.sambanova.ai/apis`.
2. In `backend/.env`, set:
   ```
   SAMBANOVA_API_KEY=your_key_here
   SAMBANOVA_MODEL=Meta-Llama-3.3-70B-Instruct
   ```
3. Restart the backend. The chat bubble (bottom-right, on every page) will start working automatically once a school code exists in the browser — no frontend config needed.

If `SAMBANOVA_API_KEY` isn't set, chat requests will fail with a clear error message rather than the app silently breaking elsewhere.


## Notes on production readiness

This is a solid MVP foundation. Before going live, consider:

- Adding request validation (e.g. `zod` or `joi`) on all controllers
- Rate limiting and helmet for the Express app
- Password reset / email verification flows
- File uploads for student/teacher avatars (e.g. via S3 or Cloudinary)
- Pagination on list endpoints for large datasets
- Automated tests (Jest/Vitest + Supertest)
- HTTPS + environment-specific CORS origins in production
