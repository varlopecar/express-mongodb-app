# Express.js MongoDB Application

A production-ready Express.js application with TypeScript, MongoDB, and comprehensive testing following best practices from [Sematext's Express.js Best Practices](https://sematext.com/blog/expressjs-best-practices/).

## Features

- **TypeScript** - Full TypeScript support with strict type checking
- **MongoDB** - Mongoose ODM with proper schema validation
- **Authentication** - JWT-based authentication with bcrypt password hashing
- **Security** - Helmet, CORS, rate limiting, and input validation
- **Logging** - Structured logging with Winston
- **Testing** - Jest with MongoDB memory server for testing
- **Performance** - Gzip compression, proper error handling
- **Code Quality** - ESLint, TypeScript strict mode

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route handlers with validation
├── middleware/      # Custom middleware
├── models/          # Mongoose models
├── providers/       # Business logic layer
├── services/        # Common business logic
├── app.ts          # Express application setup
├── routes.ts       # Route definitions
└── server.ts       # Server entry point
```

## Prerequisites

- Node.js 18+
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd express-mongodb-app
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp env.example .env
```

4. Update the `.env` file with your configuration:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/express-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Development

Start the development server:

```bash
npm run dev
```

The server will start on `http://localhost:3000` with hot reload enabled.

## Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Testing

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

### Users (Admin only)

- `GET /api/users` - Get all users with pagination
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Health Check

- `GET /health` - Server health check

## Example API Usage

### Register a new user

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get user profile (with token)

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Best Practices Implemented

Based on [Sematext's Express.js Best Practices](https://sematext.com/blog/expressjs-best-practices/):

1. **Proper Project Structure** - Separation of concerns with controllers, providers, services, and models
2. **Environment Configuration** - Using dotenv for environment variables
3. **Security Middleware** - Helmet, CORS, rate limiting
4. **Compression** - Gzip compression for better performance
5. **Structured Logging** - Winston logger with proper formatting
6. **Error Handling** - Centralized error handling middleware
7. **Input Validation** - Express-validator for request validation
8. **Authentication** - JWT tokens with proper middleware
9. **Database Connection** - Proper MongoDB connection with error handling
10. **Testing** - Comprehensive test suite with Jest

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically

## Environment Variables

| Variable                  | Description               | Default                                 |
| ------------------------- | ------------------------- | --------------------------------------- |
| `NODE_ENV`                | Environment mode          | `development`                           |
| `PORT`                    | Server port               | `3000`                                  |
| `MONGODB_URI`             | MongoDB connection string | `mongodb://localhost:27017/express-app` |
| `JWT_SECRET`              | JWT signing secret        | Required                                |
| `JWT_EXPIRES_IN`          | JWT expiration time       | `24h`                                   |
| `LOG_LEVEL`               | Logging level             | `info`                                  |
| `RATE_LIMIT_WINDOW_MS`    | Rate limit window         | `900000` (15 min)                       |
| `RATE_LIMIT_MAX_REQUESTS` | Rate limit max requests   | `100`                                   |
| `CORS_ORIGIN`             | CORS allowed origin       | `http://localhost:3000`                 |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License
