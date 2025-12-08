# GitHub Copilot Instructions - Courifly Services

## Project Overview

This is a TypeScript-based Node.js backend service for Courifly - a courier delivery and order tracking platform with logistics management features. The project uses Express.js, Knex.js for database operations, and follows a layered architecture pattern.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js v5
- **Database**: MySQL with Knex.js query builder
- **Authentication**: JWT with bcrypt for password hashing
- **Validation**: express-validator
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest with ts-jest
- **Security**: Helmet, CORS, express-rate-limit
- **Code Quality**: ESLint, Prettier

## Project Structure & Architecture

### Layered Architecture Pattern

Follow this strict separation of concerns:

```
Routes → Controllers → Services → Database
         ↓
    Middlewares (validation, auth)
```

1. **Routes** (`src/routes/`): Define API endpoints and attach middlewares
2. **Controllers** (`src/controllers/`): Handle HTTP requests/responses, call services
3. **Services** (`src/services/`): Contain business logic, interact with database
4. **Middlewares** (`src/middlewares/`): Authentication, validation, error handling
5. **Models** (`src/models/schemas/`): TypeScript types and Knex model classes
6. **Config** (`src/config/`): Configuration files (DB, CORS, Helmet, env)
7. **Utils** (`src/utils/`): Shared utilities (JWT, crypto, cookies, validation)

### Key Directories

- **Database Migrations**: `src/db/migrations/` - Knex migration files
- **Database Seeds**: `src/db/seeds/` - Seed data files
- **Validation Schemas**: `src/middlewares/validation-schemas/` - Request validation rules
- **Constants**: `src/constants/` - Enums, messages, HTTP codes, constants

## Coding Standards & Conventions

### TypeScript Guidelines

- **Strict Mode**: Always use strict TypeScript settings
- **Type Prefixes**:
  - `T` for types: `TUser`, `TProduct`, `TCreateUserData`
  - `E` for enums: `EStopStatus`, `EStopType`, `EUserRole`
- **No `any`**: Avoid using `any` type; use proper types or `unknown`
- **Path Aliases**: Use `@` prefix for imports (e.g., `@config`, `@middlewares`, `@models`)

### Naming Conventions

- **Files**: Use kebab-case: `auth.controller.ts`, `user.service.ts`
- **Classes**: PascalCase: `BaseModel`, `Stop`, `AuthService`
- **Functions/Variables**: camelCase: `getUserById`, `createProduct`
- **Constants**: UPPER_SNAKE_CASE: `ENV.PORT`, `HTTP_STATUS.OK`
- **Types/Interfaces**: PascalCase with `T` prefix: `TUser`, `TCreateOrderData`

### Model Patterns

When creating new models in `src/models/schemas/`:

```typescript
import { BaseModel, TBaseModel, TCreateIgnoreColumns, TUpdateIgnoreColumns } from './base.schema';

export type TModelName = TBaseModel & {
  field_name: string;
  nullable_field: string | null;
  // ... other fields
};

export type TCreateModelNameData = Omit<TModelName, TCreateIgnoreColumns>;
export type TUpdateModelNameData = Partial<Omit<TModelName, TUpdateIgnoreColumns>>;

export class ModelName extends BaseModel<TModelName> {}
```

### Controller Patterns

Controllers should:

- Use async/await
- Call service methods for business logic
- Handle errors with try/catch and pass to `next()`
- Return consistent response formats
- Extract data from `req.body`, `req.params`, `req.query`

```typescript
export const controllerMethod = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await someService.method(req.body);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};
```

### Service Patterns

Services should:

- Contain all business logic
- Interact with database using Knex
- Throw custom errors from `@models/errors.model`
- Be reusable and testable
- Not directly access `req` or `res` objects

### Validation Schemas

Use express-validator in `src/middlewares/validation-schemas/`:

- Define validation rules for request body, params, query
- Export arrays of validation chains
- Keep validation logic separate from controllers

### Error Handling

- Use custom error classes from `@models/errors.model`
- All errors should be caught and passed to `next()`
- The `defaultErrorHandler` middleware will format responses
- Provide meaningful error messages

## Database & Migrations

### Migration Guidelines

- **File naming**: `YYYYMMDDHHMMSS_descriptive_name.ts`
- **Always use transactions** in both `up` and `down`
- **Timestamps**: Use `.timestamps(true, true)` for `created_at` and `updated_at`
- **Foreign keys**: Define with proper `onDelete` and `onUpdate` rules
- **Indexes**: Add indexes for foreign keys and frequently queried columns

### Knex Query Patterns

- Prefer query builder over raw SQL when possible
- Use transactions for multi-table operations
- Always use parameterized queries to prevent SQL injection
- Use `.returning('*')` for insert/update operations when you need the result

## API Development

### RESTful Conventions

- **GET** `/resource` - List resources
- **GET** `/resource/:id` - Get single resource
- **POST** `/resource` - Create resource
- **PUT** `/resource/:id` - Update resource (full)
- **PATCH** `/resource/:id` - Update resource (partial)
- **DELETE** `/resource/:id` - Delete resource

### Authentication & Authorization

- Protected routes use `authenticateToken` middleware
- Role-based access control uses role middleware
- JWT tokens stored in HTTP-only cookies
- Always validate user permissions in services

### Response Formats

Maintain consistent response structures:

```typescript
// Success
{ data: {...} }
{ data: [...] }

// Error
{ error: "Error message", details: {...} }
```

## Testing

### Jest Testing Guidelines

- Write tests for services and utilities
- Use `NODE_ENV=test` for test environment
- Mock database calls in unit tests
- Test both success and error cases
- Keep test files next to source files or in `__tests__` folders

### Running Tests

- `npm test` - Run all tests
- `npm run test:watch` - Watch mode
- `npm run test:coverage` - Generate coverage report

## Development Workflow

### Before Starting Development

1. Ensure environment variables are set (`.env` file)
2. Run migrations: `npm run db:migrate:latest`
3. Seed database if needed: `npm run db:seed:run`

### Common Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm run lint` - Check code style
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types without compilation

### Code Quality

- Run `npm run lint` before committing
- Ensure all TypeScript types are properly defined
- Write meaningful commit messages
- Keep functions small and focused
- Add comments for complex business logic

## Environment Variables

Reference `ENV` object from `@config/env` instead of using `process.env` directly:

```typescript
import { ENV } from '@config/env';

const port = ENV.PORT;
const jwtSecret = ENV.JWT_SECRET;
```

## Security Best Practices

- Never commit sensitive data or credentials
- Use environment variables for all secrets
- Validate and sanitize all user inputs
- Use parameterized queries to prevent SQL injection
- Set appropriate CORS policies
- Use Helmet for security headers
- Implement rate limiting on sensitive endpoints
- Hash passwords with bcrypt (never store plain text)

## When Creating New Features

### New Entity Checklist

1. Create database migration in `src/db/migrations/`
2. Create model schema in `src/models/schemas/`
3. Create validation schema in `src/middlewares/validation-schemas/`
4. Create service in `src/services/`
5. Create controller in `src/controllers/`
6. Create middleware if needed in `src/middlewares/`
7. Create routes in `src/routes/`
8. Export from index files
9. Register routes in `src/index.ts`
10. Update Swagger documentation
11. Write tests

### Adding New Endpoints

1. Define validation schema
2. Implement service method with business logic
3. Create controller method
4. Add route with appropriate middlewares
5. Update API documentation
6. Test the endpoint

## Performance Considerations

- Use database indexes for frequently queried fields
- Implement pagination for list endpoints
- Use select statements to limit returned columns
- Consider caching for frequently accessed data
- Use connection pooling (configured in Knex)
- Avoid N+1 queries; use joins when appropriate

## Deployment

- Build with `npm run build`
- Start production with `npm run start:production`
- Ensure all migrations are run before deployment
- Use environment-specific configurations

## Additional Notes

- This project includes logistics/delivery features (stops, jobs, manifests, drivers, vehicles)
- Order management includes order items and delivery stops
- Shop management for multi-vendor courier platform
- Role-based access control for different user types
- Comprehensive validation on all inputs
- Swagger documentation available at `/docs`

## When in Doubt

- Follow existing patterns in the codebase
- Check similar implementations in other controllers/services
- Maintain consistency with existing code style
- Prioritize readability and maintainability
- Ask for clarification on business logic requirements
