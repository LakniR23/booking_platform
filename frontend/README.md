# QuickReserve — Frontend

The React (Vite + TypeScript) client for the QuickReserve booking platform. It consumes the NestJS REST API and provides a premium dark-mode UI for browsing services and managing bookings.

---

## Tech Stack

| Concern      | Technology                                  |
|--------------|---------------------------------------------|
| Framework    | React 19 + TypeScript                       |
| Build tool   | Vite 8                                      |
| Styling      | TailwindCSS v4 (`@tailwindcss/vite`)        |
| Routing      | React Router v7                             |
| Data fetching| TanStack React Query v5                     |
| HTTP client  | Axios                                       |
| Forms        | React Hook Form + Zod                       |
| Icons        | lucide-react                                |
| Notifications| react-hot-toast                             |
| Tests        | Jest + Testing Library + jsdom              |

---

## Project Structure

```
frontend/src/
├── api/           # HTTP layer
│   ├── apiClient.ts   # Axios instance (base URL + JWT interceptor)
│   ├── auth.ts        # register(), login()
│   ├── services.ts    # getServices/createService/updateService/deleteService
│   └── bookings.ts    # getBookings/createBooking/updateBookingStatus/cancelBooking
├── components/    # Navbar, Footer, ServiceModal, BookingModal
├── pages/         # Home, Login, Register, Services, Bookings
├── routes/        # Route definitions / guards
├── types/         # Shared TypeScript types
├── tests/         # Unit tests
├── __mocks__/     # Jest mocks
├── App.tsx        # Router + layout shell
├── main.tsx       # App entry point
└── setupTests.ts  # Jest setup (incl. TextEncoder polyfill for jsdom)
```

---

## Environment Variables

Create a `.env` (or `.env.local`) file in `frontend/`:

```env
VITE_API_URL="http://localhost:3000"
```

The `apiClient` reads `VITE_API_URL` so requests point at the backend. In Docker this is set to `http://localhost:3000`.

---

## Scripts

```bash
npm install        # Install dependencies
npm run dev        # Start Vite dev server (http://localhost:5173)
npm run build      # Type-check + production build
npm run preview    # Preview the production build
npm run lint       # ESLint
npm test           # Run unit tests (Jest)
```

---

## Pages & Routes

| Path        | Page      | Description                                       |
|-------------|-----------|---------------------------------------------------|
| `/`         | Home      | Landing page with featured services and CTA      |
| `/login`    | Login     | Authenticate and store the JWT                    |
| `/register` | Register  | Create a new account                              |
| `/services` | Services  | Browse, create, edit, delete services (auth)      |
| `/bookings` | Bookings  | View/manage bookings; create a public booking     |

The JWT is attached to `apiClient` requests automatically after login. See the
[root README](./README.md) and [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for backend details.
