# Courifly Services

🚀 **Courifly** - Courier delivery and order tracking platform API

## Overview

Courifly is a comprehensive logistics and delivery management platform that provides:

- 📦 **Order Management** - Create, track, and manage orders
- 🏪 **Shop Management** - Multi-vendor shop support
- 🚚 **Delivery Tracking** - Real-time order tracking with stops and jobs
- 👨‍✈️ **Driver Management** - Manage delivery drivers and their assignments
- 🚗 **Vehicle Management** - Fleet management for delivery vehicles
- 📋 **Manifest System** - Organize delivery schedules and routes

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js v5
- **Database**: MySQL with Knex.js query builder
- **Authentication**: JWT with bcrypt
- **Validation**: express-validator
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run database migrations
npm run db:migrate:latest

# Seed database (optional)
npm run db:seed:run

# Start development server
npm run dev
```

### Available Scripts

| Command                     | Description                              |
| --------------------------- | ---------------------------------------- |
| `npm run dev`               | Start development server with hot reload |
| `npm run build`             | Compile TypeScript to JavaScript         |
| `npm run start`             | Start production server                  |
| `npm run test`              | Run tests                                |
| `npm run lint`              | Check code style                         |
| `npm run db:migrate:latest` | Run database migrations                  |
| `npm run db:seed:run`       | Seed database                            |

## API Documentation

- Swagger UI: `http://localhost:3000/docs`
- Health Check: `GET /ping`

## Project Structure

```
src/
├── config/         # Configuration files
├── constants/      # Enums, messages, constants
├── controllers/    # HTTP request handlers
├── db/
│   ├── migrations/ # Database migrations
│   └── seeds/      # Seed data
├── middlewares/    # Express middlewares
├── models/         # TypeScript models & schemas
├── routes/         # API routes
├── services/       # Business logic
└── utils/          # Utility functions
```

## License

ISC
