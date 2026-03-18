# TaskFlow — Task Management System

A full-stack task management application built with **Node.js + TypeScript** (backend) and **Next.js 14 + TypeScript** (frontend).

---

## 📦 Project Structure

```
taskflow/
├── backend/          # Node.js + Express + Prisma + SQLite
└── frontend/         # Next.js 14 App Router + Tailwind CSS
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

---

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env if needed (defaults work out of the box)

# Generate Prisma client & create SQLite database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
# → API running at http://localhost:4000
```

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Environment is pre-configured for local backend
# .env.local already contains: NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Start development server
npm run dev
# → App running at http://localhost:3000
```

---

## 🏗️ Architecture

### Backend (Track A — Node.js API)

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 + TypeScript |
| Framework | Express.js |
| ORM | Prisma |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Auth | JWT (Access + Refresh tokens) |
| Password | bcryptjs (12 rounds) |
| Validation | express-validator |
| Security | helmet, cors, express-rate-limit |

**API Endpoints:**

```
POST   /api/auth/register     Register new user
POST   /api/auth/login        Login
POST   /api/auth/refresh      Refresh access token
POST   /api/auth/logout       Logout (revoke refresh token)
GET    /api/auth/me           Get current user

GET    /api/tasks             List tasks (pagination, filter, search)
POST   /api/tasks             Create task
GET    /api/tasks/:id         Get single task
PATCH  /api/tasks/:id         Update task
DELETE /api/tasks/:id         Delete task
PATCH  /api/tasks/:id/toggle  Cycle task status
```

**Query Parameters for GET /api/tasks:**
```
?page=1           Page number (default: 1)
?limit=10         Items per page (max: 50)
?status=PENDING   Filter by status (PENDING | IN_PROGRESS | COMPLETED)
?priority=HIGH    Filter by priority (LOW | MEDIUM | HIGH)
?search=keyword   Search title & description
?sortBy=dueDate   Sort field
?sortOrder=asc    Sort direction (asc | desc)
```

### Frontend (Track A — Next.js)

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Forms | React Hook Form + Zod |
| HTTP | Axios (with auto token refresh interceptor) |
| Notifications | react-hot-toast |

**Pages:**
- `/login` — Login page
- `/register` — Registration page  
- `/dashboard` — Main task management dashboard

---

## 🔒 Security Features

- **JWT Access Token** (15 min expiry) — sent as Bearer token
- **JWT Refresh Token** (7 days) — stored in DB, rotated on use
- **bcrypt** password hashing (12 rounds)
- **Rate limiting** — 100 req/15min globally, 10 req/15min on auth routes
- **Helmet** security headers
- **CORS** restricted to frontend origin
- **Input validation** on all endpoints
- **User isolation** — users can only access their own tasks

---

## 🗂️ Data Models

### User
```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  name         String
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  tasks         Task[]
  refreshTokens RefreshToken[]
}
```

### Task
```prisma
model Task {
  id          String     @id @default(uuid())
  title       String
  description String?
  status      TaskStatus @default(PENDING)   // PENDING | IN_PROGRESS | COMPLETED
  priority    Priority   @default(MEDIUM)    // LOW | MEDIUM | HIGH
  dueDate     DateTime?
  userId      String
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL="file:./dev.db"
PORT=4000
NODE_ENV=development

JWT_ACCESS_SECRET=your_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars

ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## 🏭 Production Deployment

### Backend
1. Switch `DATABASE_URL` to PostgreSQL connection string
2. Run `npx prisma migrate deploy`
3. Set strong JWT secrets
4. Build: `npm run build && npm start`

### Frontend
1. Update `NEXT_PUBLIC_API_URL` to production API URL
2. Build: `npm run build && npm start`
3. Or deploy to Vercel: `vercel --prod`

---

## 📋 Task Status Flow

```
PENDING → IN_PROGRESS → COMPLETED → PENDING (cycles)
```

The toggle endpoint (`PATCH /tasks/:id/toggle`) cycles through statuses automatically.

---

## 🧪 Testing the API

```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234","name":"Test User"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234"}'

# Create Task (replace TOKEN)
curl -X POST http://localhost:4000/api/tasks \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My first task","priority":"HIGH"}'

# List tasks with filters
curl "http://localhost:4000/api/tasks?status=PENDING&page=1&limit=5" \
  -H "Authorization: Bearer TOKEN"
```
