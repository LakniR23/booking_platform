# QuickReserve — Backend

The NestJS REST API for the QuickReserve booking platform. It handles JWT authentication, service management, and booking management on top of PostgreSQL via Prisma.

---

## Tech Stack

| Concern      | Technology                                       |
|--------------|--------------------------------------------------|
| Framework    | NestJS 11 + TypeScript                           |
| Database     | PostgreSQL                                       |
| ORM          | Prisma 7 (`@prisma/client`, `@prisma/adapter-pg`)|
| Auth         | `@nestjs/jwt`, `passport-jwt`                    |
| Validation   | `class-validator`, `class-transformer`           |
| Docs         | Swagger (`@nestjs/swagger`)                      |
| Hashing      | `bcrypt`                                         |
| Tests        | Jest + Supertest (unit specs per module)         |

---

## Project Structure

```
backend/src/
├── auth/           # Register/login, JWT strategy, guards, DTOs
├── services/       # Service CRUD (auth-protected writes)
├── bookings/       # Booking CRUD, status/cancel, DTOs
├── prisma/         # PrismaModule + PrismaService
├── common/         # Shared filters (e.g. HttpExceptionFilter)
├── app.module.ts   # Root module wiring
└── main.ts         # Bootstrap + Swagger setup
```

> Note: A `users/` module exists in the source tree but is not currently wired
> into `AppModule`, so its routes are inactive.

---

## Scripts

```bash
npm install        # Install dependencies
npm run start:dev  # Start with watch mode (http://localhost:3000)
npm run build      # Compile to dist/
npm run start:prod # Run the production build
npm run lint       # ESLint
npm test           # Run unit tests (Jest)
npm run test:e2e   # Run end-to-end tests
```

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/booking_platform"
JWT_SECRET="your-very-secret-key"
PORT=3000
```

---

## Database

Migrations live in `prisma/migrations/`. The Prisma client is generated to `generated/prisma`.

```bash
npx prisma migrate dev   # apply migrations
npx prisma generate      # generate client
npx prisma studio        # GUI at http://localhost:5555
```

See [DATABASE_MIGRATIONS.md](../DATABASE_MIGRATIONS.md) for the full schema reference and
[API_DOCUMENTATION.md](../API_DOCUMENTATION.md) for endpoint details.
