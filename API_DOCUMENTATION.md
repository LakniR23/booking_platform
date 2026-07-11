# QuickReserve – API Documentation

**Base URL:** `http://localhost:3000`  
**Interactive Docs (Swagger):** `http://localhost:3000/api/docs`  
**Postman Collection:** `QuickReserve.postman_collection.json` (import into Postman for a ready-to-use collection)

---

## Authentication

All protected endpoints require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <your_access_token>
```

---

## 1. Auth Endpoints

### POST `/auth/register`
Register a new user account.

- **Auth Required:** No
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response `201`:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER"
  }
}
```
- **Response `409`:** User with this email already exists.

---

### POST `/auth/login`
Login and receive a JWT access token.

- **Auth Required:** No
- **Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response `200`:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **Response `401`:** Invalid credentials.

---

### POST `/auth/refresh`
Refresh an expired access token using a valid refresh token.

- **Auth Required:** No
- **Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **Response `200`:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **Response `401`:** Invalid or expired refresh token.

---

## 2. Service Endpoints

### POST `/services`
Create a new service.

- **Auth Required:** Yes
- **Request Body:**
```json
{
  "title": "Men's Haircut",
  "description": "Professional men's haircut and styling",
  "duration": 30,
  "price": 25.00,
  "isActive": true
}
```
- **Response `201`:** Returns the created service object.

---

### GET `/services`
Get all services.

- **Auth Required:** No
- **Response `200`:**
```json
[
  {
    "id": "uuid",
    "title": "Men's Haircut",
    "description": "Professional men's haircut and styling",
    "duration": 30,
    "price": 25.00,
    "isActive": true,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

---

### GET `/services/:id`
Get a single service by ID.

- **Auth Required:** No
- **URL Params:** `id` — UUID of the service
- **Response `200`:** Returns the service object.
- **Response `404`:** Service not found.

---

### PATCH `/services/:id`
Update an existing service (partial update).

- **Auth Required:** Yes
- **URL Params:** `id` — UUID of the service
- **Request Body:** Any subset of service fields:
```json
{
  "price": 30.00,
  "isActive": false
}
```
- **Response `200`:** Returns the updated service object.
- **Response `404`:** Service not found.

---

### DELETE `/services/:id`
Delete a service.

- **Auth Required:** Yes
- **URL Params:** `id` — UUID of the service
- **Response `200`:** Returns the deleted service object.
- **Response `404`:** Service not found.

---

## 3. Booking Endpoints

### POST `/bookings`
Create a new booking. No authentication required — customers can book directly.

- **Auth Required:** No
- **Request Body:**
```json
{
  "customerName": "Jane Smith",
  "customerEmail": "jane@example.com",
  "customerPhone": "+94771234567",
  "serviceId": "service-uuid-here",
  "bookingDate": "2026-12-31",
  "bookingTime": "10:00",
  "notes": "Please prepare in advance"
}
```
- **Validation Rules:**
  - `bookingDate` must be in `YYYY-MM-DD` format and **not in the past**
  - `bookingTime` must be in `HH:MM` format
  - `serviceId` must reference an existing service
  - Duplicate booking for same service + date + time is rejected
- **Response `201`:** Returns the created booking object.
- **Response `400`:** Booking date is in the past.
- **Response `404`:** Service not found.
- **Response `409`:** Time slot already booked.

---

### GET `/bookings`
Get all bookings (with service details included).

- **Auth Required:** Yes
- **Response `200`:**
```json
[
  {
    "id": "uuid",
    "customerName": "Jane Smith",
    "customerEmail": "jane@example.com",
    "customerPhone": "+94771234567",
    "serviceId": "uuid",
    "service": { "id": "uuid", "title": "Men's Haircut", "price": 25.00 },
    "bookingDate": "2026-12-31T00:00:00.000Z",
    "bookingTime": "10:00",
    "status": "PENDING",
    "notes": "Please prepare in advance",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
]
```

---

### GET `/bookings/:id`
Get a single booking by ID.

- **Auth Required:** Yes
- **URL Params:** `id` — UUID of the booking
- **Response `200`:** Returns the booking object with service details.
- **Response `404`:** Booking not found.

---

### PATCH `/bookings/:id/status`
Update the status of a booking.

- **Auth Required:** Yes
- **URL Params:** `id` — UUID of the booking
- **Request Body:**
```json
{
  "status": "CONFIRMED"
}
```
- **Allowed Values:** `PENDING` | `CONFIRMED` | `CANCELLED` | `COMPLETED`
- **Business Rule:** A `CANCELLED` booking **cannot** be marked as `COMPLETED`.
- **Response `200`:** Returns the updated booking.
- **Response `400`:** Cannot complete a cancelled booking.

---

### PATCH `/bookings/:id/cancel`
Cancel a booking.

- **Auth Required:** No
- **URL Params:** `id` — UUID of the booking
- **Response `200`:** Returns the booking with `status: "CANCELLED"`.
- **Response `404`:** Booking not found.

---

## Booking Status Enum

| Value       | Description                        |
|-------------|------------------------------------|
| `PENDING`   | Booking submitted, awaiting review |
| `CONFIRMED` | Booking confirmed by staff         |
| `CANCELLED` | Booking cancelled                  |
| `COMPLETED` | Service has been completed         |

---

## Database Seeding

To populate the database with sample data for development and testing, run the seed script from the `backend/` directory:

```bash
npx ts-node seed.ts
```

This inserts:
- **30 services** across categories (haircuts, massages, cleaning, tutoring, personal training)
- **50 bookings** with varied statuses (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`) and realistic customer data

To re-seed, reset the database first:

```bash
npx prisma migrate reset
npx ts-node seed.ts
```

> ⚠️ `prisma migrate reset` deletes all data. Use only in development.

---

## Error Response Format

All error responses follow a consistent structure:

```json
{
  "statusCode": 400,
  "timestamp": "2026-01-01T00:00:00.000Z",
  "path": "/bookings",
  "message": "Booking dates cannot be in the past"
}
```
