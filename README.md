# QuickReserve – Booking Platform

A full-stack booking platform REST API built with **NestJS**, **PostgreSQL**, and **Prisma**. It allows businesses to manage services and lets customers book those services seamlessly.

---

## Project Overview

**QuickReserve** is a RESTful backend system built as part of the EN2H Software Engineer Intern Technical Assignment. It supports:

- **JWT Authentication** (Register & Login)
- **Service Management** — authenticated users can create, update, delete, and fetch services
- **Booking Management** — customers can create bookings without authentication; authenticated users can manage booking statuses
- **Business Rule Enforcement** — past date validation, duplicate booking prevention, cancelled → completed restriction
- **Swagger API Documentation** at `/api/docs`
- **Global Validation & Exception Handling**

The project also includes a **React (Vite + TypeScript)** frontend using TailwindCSS v4 for a premium dark-mode UI.

---

## Tech Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Framework  | NestJS (TypeScript)                  |
| Database   | PostgreSQL                           |
| ORM        | Prisma 7                             |
| Auth       | JWT (`@nestjs/jwt`, `passport-jwt`)  |
| Validation | `class-validator`, `class-transformer` |
| Docs       | Swagger (`@nestjs/swagger`)          |
| Frontend   | React 19, Vite 8, TailwindCSS v4     |
| HTTP Client| Axios, TanStack React Query          |
| Forms      | React Hook Form, Zod                 |
| UI/UX      | lucide-react, react-hot-toast        |

---

## Project Structure

```
booking-platform/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── src/
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   ├── guards/
│   │   │   ├── strategies/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.middleware.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.validation.ts
│   │   ├── bookings/
│   │   │   ├── dto/
│   │   │   ├── bookings.controller.ts
│   │   │   ├── bookings.middleware.ts
│   │   │   ├── bookings.module.ts
│   │   │   ├── bookings.service.ts
│   │   │   └── bookings.validation.ts
│   │   ├── services/
│   │   │   ├── dto/
│   │   │   ├── services.controller.ts
│   │   │   ├── services.middleware.ts
│   │   │   ├── services.module.ts
│   │   │   ├── services.service.ts
│   │   │   └── services.validation.ts
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   ├── common/
│   │   │   └── filters/
│   │   │       └── http-exception.filter.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env
│   ├── .env.example
│   └── prisma.config.ts
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── pages/
    │   └── types/
    └── index.html
```

---

## Environment Variables

Create a `.env` file inside the `backend/` directory by copying `.env.example`:

```bash
cp .env.example .env
```

| Variable               | Description                                          | Example                                              |
|------------------------|------------------------------------------------------|-------------------------------------------------------|
| `DATABASE_URL`         | PostgreSQL connection string                          | `postgresql://user:password@localhost:5432/booking_platform` |
| `JWT_SECRET`           | Secret key used to sign access JWT tokens            | `your-very-secret-key`                                |
| `JWT_REFRESH_SECRET`   | Secret key used to sign refresh JWT tokens           | `your-very-secret-refresh-key`                        |
| `JWT_EXPIRES_IN`       | Access token expiration duration                     | `7d`                                                  |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration duration                  | `7d`                                                  |
| `PORT`                 | Port the server runs on (optional)                   | `3000`                                                |

---

## Installation Steps

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) running locally or via cloud
- npm

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd booking-platform
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Seed the Database

```bash
npx ts-node seed.ts
```

This populates the database with 30 services and 50 bookings.

### 4. Frontend Setup

```bash
cd ../frontend
npm install
```

---

## Database Setup

1. Create the database in PostgreSQL:

```sql
CREATE DATABASE booking_platform;
```

2. Set your `DATABASE_URL` in `backend/.env`:

```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/booking_platform"
```

---

## Running Migrations

From the `backend/` directory:

```bash
npx prisma migrate dev --name init
```

This will create all the required tables (`User`, `Service`, `Booking`) in your database.

To view your data via Prisma Studio:

```bash
npx prisma studio
```

---

## Running the Application

### Backend

```bash
cd backend
npm run start:dev
```

Server starts at: **http://localhost:3000**

### Frontend

Open a separate terminal:

```bash
cd frontend
npm run dev
```

Frontend starts at: **http://localhost:5173**

---

## API Documentation

Interactive Swagger docs available at:

**http://localhost:3000/api/docs**

### Auth Endpoints

| Method | Endpoint         | Auth     | Description       |
|--------|------------------|----------|-------------------|
| POST   | `/auth/register` | Public   | Register new user |
| POST   | `/auth/login`    | Public   | Login, get JWT    |

### Service Endpoints

| Method | Endpoint          | Auth     | Description         |
|--------|-------------------|----------|---------------------|
| POST   | `/services`       | Required | Create service      |
| GET    | `/services`       | Public   | Get all services    |
| GET    | `/services/:id`   | Public   | Get service by ID   |
| PATCH  | `/services/:id`   | Required | Update service      |
| DELETE | `/services/:id`   | Required | Delete service      |

### Booking Endpoints

| Method | Endpoint                  | Auth     | Description           |
|--------|---------------------------|----------|-----------------------|
| POST   | `/bookings`               | Public   | Create booking        |
| GET    | `/bookings`               | Required | Get all bookings      |
| GET    | `/bookings/:id`           | Required | Get booking by ID     |
| PATCH  | `/bookings/:id/status`    | Required | Update booking status |
| PATCH  | `/bookings/:id/cancel`    | Public   | Cancel a booking      |

---

## Business Rules

- A booking must belong to an **existing, active service**
- **Booking dates cannot be in the past**
- **Cancelled bookings cannot be marked as completed**
- Only **authenticated users** can manage services
- **Customers can create bookings** without authentication
- **Duplicate bookings** for the same service, date, and time are prevented

---

## Assumptions Made

1. A single `User` model covers both admin and regular users, differentiated by the `role` field (`ADMIN` | `CUSTOMER`).
2. Booking cancellation is a public endpoint to allow customers to cancel their own bookings without needing an account.
3. The `bookingTime` is stored as a string in `HH:MM` format for simplicity and timezone neutrality.
4. Service `isActive` flag is used to soft-disable services without deleting historical booking data.

---

## Frontend Pages & Routes

| Path        | Page      | Description                                          |
|-------------|-----------|------------------------------------------------------|
| `/`         | Home      | Landing page with featured services and CTA         |
| `/login`    | Login     | Authenticate and receive a JWT                       |
| `/register` | Register  | Create a new account                                 |
| `/services` | Services  | Browse, create, edit, and delete services (auth)     |
| `/bookings` | Bookings  | View and manage bookings; create a public booking    |

The frontend uses a global `apiClient` (Axios) wired with TanStack React Query, React Hook Form + Zod for validation, and `react-hot-toast` for notifications.

---

## Docker Support

The project ships with `Dockerfile`s for both services plus a `docker-compose.yml` (PostgreSQL + backend + frontend). One-command startup:

```bash
docker compose up --build
```

See [INSTALLATION.md](./INSTALLATION.md) for full details.

---

## API Testing

- **Swagger UI:** `http://localhost:3000/api/docs`
- **Postman:** import `QuickReserve.postman_collection.json` for a ready-to-use collection covering auth, services, and bookings.

---

## Tests

Both layers include automated tests (Jest):

```bash
# Backend unit tests
cd backend && npm test

# Frontend unit tests
cd frontend && npm test
```

---

## Future Improvements

- [ ] Email and SMS notifications for booking confirmations, reminders, and cancellations
- [ ] Password reset and email verification flows
- [ ] Payment gateway integration (Stripe, Razorpay) for paid bookings
- [ ] Service availability calendar with time-slot management
- [ ] Google Calendar and Outlook calendar sync
- [ ] Booking reminder notifications (email/SMS) before appointments
- [ ] Service categories, tags, and advanced search/filtering by availability
- [ ] Ratings and reviews for completed bookings
- [ ] Admin analytics dashboard for revenue, occupancy, and booking trends
- [ ] Audit log for booking and service changes
- [ ] File upload and gallery for service images
- [ ] Progressive Web App (PWA) support for mobile users

---

## License

This project was developed as part of an internship technical assignment for **EN2H**.
