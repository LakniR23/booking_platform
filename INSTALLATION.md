# QuickReserve – Installation Instructions

A step-by-step guide to install and run the QuickReserve Booking Platform locally.

---

## Prerequisites

Ensure the following are installed on your system:

| Tool       | Version  | Download                              |
|------------|----------|---------------------------------------|
| Node.js    | v18+     | https://nodejs.org/                   |
| npm        | v9+      | Included with Node.js                 |
| PostgreSQL | v14+     | https://www.postgresql.org/download/  |
| Git        | Latest   | https://git-scm.com/                  |

---

## Step 1 — Clone the Repository

```bash
git clone <your-repo-url>
cd booking-platform
```

---

## Step 2 — Backend Installation

```bash
cd backend
npm install
```

### Configure Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and update:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/booking_platform"
JWT_SECRET="your-very-secret-key"
PORT=3000
```

---

## Step 3 — Database Setup

### Create the PostgreSQL Database

Connect to your PostgreSQL instance and run:

```sql
CREATE DATABASE booking_platform;
```

### Run Prisma Migrations

From the `backend/` directory:

```bash
npx prisma migrate dev
```

This creates all required tables (`User`, `Service`, `Booking`).

### Seed the Database

```bash
npx ts-node seed.ts
```

This populates the database with 30 services and 50 bookings.

### Generate Prisma Client

```bash
npx prisma generate
```

---

## Step 4 — Frontend Installation

Open a new terminal:

```bash
cd frontend
npm install
```

---

## Step 5 — Run the Application

### Start the Backend

```bash
cd backend
npm run start:dev
```

✅ Backend is running at: `http://localhost:3000`  
📖 Swagger API docs at: `http://localhost:3000/api/docs`

---

### Start the Frontend

In a separate terminal:

```bash
cd frontend
npm run dev
```

✅ Frontend is running at: `http://localhost:5173`

---

## Docker Option (One-Command Setup)

A `docker-compose.yml` is provided with PostgreSQL, the backend, and the frontend.

> ⚠️ The compose file uses default credentials (`postgres` / `password`) for local dev only.

```bash
# From the project root
docker compose up --build
```

- Backend: `http://localhost:3000` (Swagger at `/api/docs`)
- Frontend: `http://localhost:5173`
- PostgreSQL: `localhost:5432`

To stop and remove containers:

```bash
docker compose down
```

---

## Verify Everything is Working

1. Open your browser and go to `http://localhost:5173` — you should see the QuickReserve homepage.
2. Open `http://localhost:3000/api/docs` to explore the interactive API docs.
3. Register a user at `POST /auth/register`, then login at `POST /auth/login` to get your JWT token.

---

## Common Issues

| Issue | Fix |
|-------|-----|
| `ECONNREFUSED` on database | Ensure PostgreSQL is running and `DATABASE_URL` is correct |
| `Port 3000 already in use` | Change `PORT=3001` in `.env` |
| Migration fails | Ensure the `booking_platform` database exists in PostgreSQL |
| Frontend can't reach backend | Ensure backend is running on port `3000` |

---

## Useful Commands

```bash
# View database records visually
npx prisma studio

# Reset the database (dev only — deletes all data)
npx prisma migrate reset

# Build backend for production
npm run build

# Build frontend for production
npm run build
```
