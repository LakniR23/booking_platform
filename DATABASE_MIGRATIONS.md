# QuickReserve – Database Migration Guide

This document explains the database schema and how to run migrations.

---

## Database: PostgreSQL

The application uses **PostgreSQL** with **Prisma ORM** for schema management and migrations.

---

## Schema Overview

### User
Stores registered platform users (admins/staff who manage services).

| Column      | Type       | Description                         |
|-------------|------------|-------------------------------------|
| `id`        | UUID (PK)  | Auto-generated unique identifier    |
| `name`      | String     | Full name of the user               |
| `email`     | String     | Unique email address                |
| `password`  | String     | Bcrypt-hashed password              |
| `role`      | Enum       | `CUSTOMER` or `ADMIN` (default: `CUSTOMER`) |
| `createdAt` | DateTime   | Record creation timestamp           |
| `updatedAt` | DateTime   | Last update timestamp               |

---

### Service
Represents a bookable service offered on the platform.

| Column        | Type      | Description                          |
|---------------|-----------|--------------------------------------|
| `id`          | UUID (PK) | Auto-generated unique identifier     |
| `title`       | String    | Name of the service                  |
| `description` | String?   | Optional description                 |
| `duration`    | Int       | Duration in minutes                  |
| `price`       | Float     | Price of the service                 |
| `isActive`    | Boolean   | Whether the service is bookable      |
| `createdAt`   | DateTime  | Record creation timestamp            |
| `updatedAt`   | DateTime  | Last update timestamp                |

---

### Booking
Represents a customer's booking for a specific service.

| Column          | Type       | Description                                     |
|-----------------|------------|-------------------------------------------------|
| `id`            | UUID (PK)  | Auto-generated unique identifier                |
| `customerName`  | String     | Full name of the customer                       |
| `customerEmail` | String     | Customer's email address                        |
| `customerPhone` | String     | Customer's phone number                         |
| `serviceId`     | UUID (FK)  | References `Service.id` with `ON DELETE CASCADE` |
| `bookingDate`   | Date       | Date of the booking (`YYYY-MM-DD`)              |
| `bookingTime`   | String     | Time of the booking (`HH:MM`)                   |
| `status`        | Enum       | `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`|
| `notes`         | String?    | Optional customer notes                         |
| `createdAt`     | DateTime   | Record creation timestamp                       |
| `updatedAt`     | DateTime   | Last update timestamp                           |

**Unique Constraint:** `(serviceId, bookingDate, bookingTime)` — prevents double-bookings.

---

### Enums

```prisma
enum Role {
  CUSTOMER
  ADMIN
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}
```

---

## Running Migrations

### Step 1 — Ensure your database exists

Connect to PostgreSQL and create the database:

```sql
CREATE DATABASE booking_platform;
```

### Step 2 — Set your DATABASE_URL in `.env`

```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/booking_platform"
```

### Step 3 — Run the migration

From the `backend/` directory:

```bash
npx prisma migrate dev
```

This applies all pending migration files from `prisma/migrations/`.

---

### Resetting the Database (Dev only)

To wipe all data and re-run migrations from scratch:

```bash
npx prisma migrate reset
```

> ⚠️ This deletes all data. Use only in development.

---

### Viewing Migration Files

Migration SQL files are stored in:

```
backend/prisma/migrations/
├── 20260709163435_init/
│   └── migration.sql
├── 20260709195246_init/
│   └── migration.sql
└── 20260711180114_add_cascade_delete_on_service/
    └── migration.sql
```

These files are committed to the repository so the schema is fully reproducible.

> The Prisma client is generated to `backend/generated/prisma` (configured via the
> `generator client { output = "../generated/prisma" }` block in `schema.prisma`).

---

### Prisma Studio (GUI)

To browse database records visually:

```bash
npx prisma studio
```

Opens at **http://localhost:5555**
