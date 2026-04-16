# PharmX Backend API

A production-ready Node.js REST API built with Express.js, TypeScript, Prisma ORM, and PostgreSQL.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Working with Prisma](#working-with-prisma)
- [Authentication](#authentication)
- [Configuration](#configuration)

---

## Project Overview

PharmX is a pharmacy management backend API that provides endpoints for:
- User authentication (register/login)
- Order management
- Inventory tracking
- Payment processing
- Order item tracking

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT + Passport.js |
| Password Hashing | bcryptjs |
| Validation | express-validator |

---

## Project Structure

```
apps/backend/
├── src/
│   ├── index.ts                 # Application entry point
│   ├── app.ts                   # Express app configuration
│   ├── config/
│   │   ├── env.ts               # Environment variables
│   │   └── passport.ts         # Passport.js strategies
│   ├── controllers/
│   │   ├── auth.controller.ts  # Authentication logic
│   │   ├── user.controller.ts  # User profile operations
│   │   ├── orders.controller.ts
│   │   ├── order.item.controller.ts
│   │   ├── inventory.controller.ts
│   │   └── payment.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts  # JWT authentication
│   │   └── error.middleware.ts # Global error handler
│   ├── prisma/
│   │   └── client.ts           # Prisma client singleton
│   └── routes/
│       ├── index.ts            # Main router
│       ├── auth.routes.ts      # Auth endpoints
│       ├── user.routes.ts      # User endpoints
│       ├── orders.routes.ts
│       ├── order.item.routes.ts
│       ├── inventory.routes.ts
│       └── payment.routes.ts
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── .env                       # Environment variables
├── package.json
├── tsconfig.json
└── nodemon.json
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- npm or yarn

### Installation

```bash
cd apps/backend
npm install
```

### Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE pharmx;
```

2. Configure your `.env` file:
```
DATABASE_URL="postgresql://user:password@localhost:5432/pharmx"
JWT_SECRET="your-secret-key"
PORT=3000
```

3. Run migrations:
```bash
npx prisma migrate dev --name init
```

4. Generate Prisma client:
```bash
npx prisma generate
```

### Development

```bash
npm run dev      # Start dev server with hot reload
npm run build    # Compile TypeScript
npm run start    # Run production server
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login & get JWT | No |

### User

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/user/profile` | Get user profile | Yes |

### Orders

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/orders` | List all orders | No |
| POST | `/api/orders` | Create order | No |

### Order Items

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/order-items` | List all order items | No |

### Inventory

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/inventory` | List all inventory items | No |

### Payments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/payments` | List all payments | No |

---

## Database Schema

### User
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}
```

### Order
```prisma
model Order {
  id          String      @id @default(uuid())
  userId      String
  totalAmount Float
  status      String
  createdAt   DateTime    @default(now())
  orderItems  OrderItem[]
}
```

### OrderItem
```prisma
model OrderItem {
  id        String   @id @default(uuid())
  orderId   String
  productId String
  quantity  Int
  price     Float
  order     Order    @relation(fields: [orderId], references: [id])
}
```

### Inventory
```prisma
model Inventory {
  id          String   @id @default(uuid())
  productName String
  quantity    Int
  lowStock    Int
  updatedAt   DateTime @default(now())
}
```

### Payment
```prisma
model Payment {
  id          String   @id @default(uuid())
  orderId     String
  amount      Float
  method      String
  status      String
  createdAt   DateTime @default(now())
}
```

---

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Login Flow
1. Send POST to `/api/auth/login` with email and password
2. Receive JWT token in response
3. Include token in Authorization header: `Bearer <token>`

### Protected Routes
Add the `authMiddleware` to any route to protect it:
```typescript
import { authMiddleware } from '../middleware/auth.middleware';

router.get('/profile', authMiddleware, getProfile);
```

---

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | Required |
| JWT_SECRET | Secret key for JWT signing | Required |
| PORT | Server port | 3000 |

### Example `.env`
```
DATABASE_URL="postgresql://max:max@localhost:5432/pharmx"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3000
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run start` | Run compiled production server |
| `npx prisma studio` | Open Prisma database GUI |
| `npx prisma migrate dev` | Apply database migrations |

---

## Working with Prisma

### Common Commands

| Command | Description |
|---------|-------------|
| `npx prisma migrate dev` | Create & apply migrations (dev only) |
| `npx prisma migrate deploy` | Apply migrations (production) |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma studio` | Open visual database editor |
| `npx prisma db push` | Push schema to database (without migration) |
| `npx prisma db reset` | Reset database & re-run all migrations |

### Schema Workflow

1. **Edit schema** - Modify `prisma/schema.prisma` to add/update models
2. **Generate client** - Run `npx prisma generate` to update TypeScript types
3. **Create migration** - Run `npx prisma migrate dev --name <name>` to apply changes
4. **Verify** - Check database with `npx prisma studio` or query via API

### Using Prisma in Controllers

Import the singleton client:

```typescript
import prisma from '../prisma/client';

// Query examples
const users = await prisma.user.findMany();
const user = await prisma.user.findUnique({ where: { id: 'uuid' } });
const createUser = await prisma.user.create({ data: { email, password } });
const updateUser = await prisma.user.update({ where: { id }, data: {} });
const deleteUser = await prisma.user.delete({ where: { id } });
```

### Database Studio

Open a visual interface to view/edit data:

```bash
npx prisma studio
```

This opens a web UI at `http://localhost:5555` where you can browse tables, view records, and make changes.

---

## Error Handling

The application uses a global error handler middleware (`src/middleware/error.middleware.ts`) that catches all unhandled errors and returns a standardized JSON response.

---
