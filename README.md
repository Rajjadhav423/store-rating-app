# Store Rating App

Full-stack store rating application with role-based access for **System Administrator**, **Normal User**, and **Store Owner**.

## Tech Stack

- Frontend: React + Vite
- Backend: Express.js
- Database: PostgreSQL
- Auth: JWT
- Password Hashing: bcrypt

## Architecture

- Frontend and backend are managed via npm workspaces.
- Backend structure follows: `routes -> middleware -> controllers -> services -> database`.
- Centralized error handling is implemented on backend.

## Folder Structure

```text
backend/
  src/
    config/
    controllers/
    db/
    middleware/
    routes/
    services/
    utils/
    validators/
  test/
frontend/
  src/
    components/
    context/
    pages/
    utils/
```

## Environment Variables

### Backend (`backend/.env`)

Use `backend/.env.example` as template.

Key vars:

- `PORT`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DATABASE_URL` (optional alternative)
- `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_ADDRESS`

### Frontend (`frontend/.env`)

Use `frontend/.env.example`:

- `VITE_API_URL` (example: `http://localhost:4000/api`)

## Database Setup

1. Create PostgreSQL database.
2. Configure backend env values.
3. Run migration:

```bash
npm run migrate
```

## Seed Data

Creates initial system admin from env variables.

```bash
npm run seed
```

## Backend Setup

```bash
npm install
npm run migrate
npm run seed
npm run dev:backend
```

## Frontend Setup

```bash
npm install
npm run dev:frontend
```

## Run Both

```bash
npm run dev
```

## Build / Lint / Test

```bash
npm run build
npm run lint
npm run test
```

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/change-password` (auth)
- `POST /api/auth/logout` (auth)

### Admin (ADMIN only)

- `GET /api/admin/dashboard`
- `POST /api/admin/users`
- `GET /api/admin/users`
- `GET /api/admin/users/:id`
- `POST /api/admin/stores`
- `GET /api/admin/stores`

### Stores (USER only)

- `GET /api/stores`

### Ratings

- `POST /api/ratings` (USER)
- `GET /api/ratings/my/:storeId` (USER)
- `GET /api/ratings/store/:storeId` (ADMIN/OWNER with owner isolation)

### Store Owner

- `GET /api/store-owner/dashboard` (OWNER)

## Roles and Permissions

- **ADMIN**: dashboard, user management, store creation/listing.
- **USER**: register/login, view stores, submit/update own ratings, change password.
- **OWNER**: login, dashboard for own store only, change password.

## Validation Rules

Backend + frontend enforce:

- Name: 20–60 chars
- Address: max 400 chars
- Password: 8–16 chars, one uppercase, one special char
- Email: standard email format
- Rating: integer 1..5

## Security Notes

- Password hashes are stored with bcrypt.
- JWT is required for protected APIs.
- Role checks are enforced server-side.
- Sensitive fields (password hash) are never returned.
- SQL uses parameterized queries.
- Sort fields are whitelisted.

## Testing Coverage Included

- Validation tests for registration/password/name constraints.
- Validation tests for rating range constraints.

