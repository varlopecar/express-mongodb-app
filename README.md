# Blog API - Node.js + MongoDB

A RESTful API for managing blog posts built with Express.js, TypeScript, and MongoDB. This API serves as the backend for the React frontend's blog functionality.

## Features

- **Blog Post Management**: Create, read, update, and delete blog posts
- **User Management**: User registration, authentication, and authorization
- **RESTful API**: Full CRUD operations for blog posts and users
- **Validation**: Input validation using express-validator
- **Error Handling**: Comprehensive error handling and logging
- **CORS Support**: Configured for cross-origin requests from React frontend
- **Rate Limiting**: Protection against abuse
- **Security**: Helmet for security headers, JWT authentication
- **Testing**: Comprehensive test suite with Jest (unit and integration tests)
- **Docker Support**: Complete Docker setup with MongoDB

## Architecture

This API is part of a dual API architecture:

1. **Python FastAPI + MySQL**: User management and authentication (separate repository)
2. **Node.js + MongoDB**: Blog posts and content management (this repository)
3. **React Frontend**: User interface that connects to both APIs

## API Endpoints

### Blog Posts

- `GET /posts` - Get all blog posts (sorted by creation date)
- `GET /posts/:id` - Get a specific blog post
- `POST /posts` - Create a new blog post
- `PUT /posts/:id` - Update an existing blog post
- `DELETE /posts/:id` - Delete a blog post

### Users

- `GET /users` - Get all users
- `GET /users/:id` - Get a specific user
- `POST /users` - Create a new user
- `PUT /users/:id` - Update an existing user
- `DELETE /users/:id` - Delete a user

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Health Check

- `GET /health` - API health status
- `GET /` - API information and available endpoints

## Data Schemas

### Blog Post Schema

```typescript
interface BlogPost {
  _id: string;
  title: string; // Required, 1-200 characters
  content: string; // Required, 1-10000 characters
  author: string; // Required, 1-100 characters
  createdAt: Date; // Auto-generated
  updatedAt: Date; // Auto-generated
}
```

### User Schema

```typescript
interface User {
  _id: string;
  username: string; // Required, unique
  email: string; // Required, unique
  password: string; // Required, hashed
  role: string; // Default: 'user'
  createdAt: Date; // Auto-generated
  updatedAt: Date; // Auto-generated
}
```

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd express-mongodb-app

# Install dependencies
pnpm install

# Copy environment file
cp env.example .env

# Build the project
pnpm run build

# Start development server
pnpm run dev
```

## Docker Setup

### Quick Start with Docker

```bash
# Start all services
pnpm run docker:up

# View logs
pnpm run docker:logs

# Stop services
pnpm run docker:down
```

### Services

- **MongoDB**: Database server (port 27017)
- **Blog API**: Express.js server (port 3001)
- **Mongo Express**: Database management UI (port 8081)

### Access Points

- **API**: http://localhost:3001
- **Mongo Express**: http://localhost:8081 (admin/password)
- **Health Check**: http://localhost:3001/health

## Environment Variables

Create a `.env` file based on `env.example`:

```env
# Server Configuration
NODE_ENV=development
PORT=3001

# MongoDB Configuration
MONGODB_URI=mongodb://admin:password@localhost:27017/blog_db?authSource=admin

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,https://varlopecar.github.io

# JWT Configuration (if needed for future features)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

## Development

```bash
# Start development server
pnpm run dev

# Run tests
pnpm test

# Run tests with coverage
pnpm run test:coverage

# Run tests in watch mode
pnpm run test:watch

# Lint code
pnpm run lint

# Fix linting issues
pnpm run lint:fix

# Seed database with sample data
pnpm run seed
```

## Testing

The project includes comprehensive tests:

- **Unit Tests**: API endpoint testing
- **Integration Tests**: Database operations
- **Validation Tests**: Input validation
- **Error Handling Tests**: Error scenarios

Run tests with:

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm run test:coverage

# Run in watch mode
pnpm run test:watch
```

## API Examples

### Create a Blog Post

```bash
curl -X POST http://localhost:3001/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post...",
    "author": "John Doe"
  }'
```

### Get All Blog Posts

```bash
curl http://localhost:3001/posts
```

### Get a Specific Blog Post

```bash
curl http://localhost:3001/posts/POST_ID
```

### Update a Blog Post

```bash
curl -X PUT http://localhost:3001/posts/POST_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content...",
    "author": "John Doe"
  }'
```

### Delete a Blog Post

```bash
curl -X DELETE http://localhost:3001/posts/POST_ID
```

## Integration with React Frontend

The React frontend is configured to connect to this API using the `VITE_BLOG_API_URL` environment variable. The frontend will:

- Fetch blog posts for the homepage
- Display posts in a responsive grid
- Allow deletion of posts (if needed)

## CORS Configuration

The API is configured to accept requests from:

- `http://localhost:3000` (React development server)
- `https://varlopecar.github.io` (GitHub Pages deployment)

## Security Features

- **Helmet**: Security headers
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive validation
- **CORS**: Controlled cross-origin access
- **Error Handling**: Secure error responses

## Logging

The API uses Winston for logging with configurable log levels:

- **Development**: Detailed logging
- **Production**: Essential logs only

## Deployment

### Docker Deployment

```bash
# Build and start services
pnpm run docker:up

# View logs
pnpm run docker:logs
```

### Manual Deployment

```bash
# Build the application
pnpm run build

# Start production server
pnpm start
```

## Project Structure

```
express-mongodb-app/
├── src/
│   ├── controllers/          # Route controllers
│   │   ├── postController.ts # Blog post endpoints
│   │   ├── userController.ts # User management endpoints
│   │   └── authController.ts # Authentication endpoints
│   ├── models/              # Database models
│   │   ├── Post.ts          # Blog post model
│   │   ├── User.ts          # User model
│   │   └── index.ts         # Model exports
│   ├── services/            # Business logic services
│   │   ├── authService.ts   # Authentication service
│   │   └── userService.ts   # User management service
│   ├── providers/           # Data providers
│   │   ├── authProvider.ts  # Authentication provider
│   │   └── userProvider.ts  # User data provider
│   ├── middleware/          # Express middleware
│   │   ├── authMiddleware.ts # JWT authentication
│   │   ├── adminMiddleware.ts # Admin role verification
│   │   ├── errorMiddleware.ts # Error handling
│   │   └── validationMiddleware.ts # Input validation
│   ├── config/              # Configuration files
│   │   ├── database.ts      # Database configuration
│   │   ├── logger.ts        # Logging configuration
│   │   └── index.ts         # Config exports
│   ├── scripts/             # Utility scripts
│   │   └── seed.ts          # Database seeding
│   ├── app.ts               # Express app setup
│   ├── routes.ts            # Route definitions
│   └── server.ts            # Server entry point
├── test/                    # Test files
│   ├── unit/                # Unit tests
│   │   └── authService.test.ts # Authentication service tests
│   ├── integration/         # Integration tests
│   ├── post.test.ts         # Blog post API tests
│   ├── setup.ts             # Test setup
│   └── jest.setup.js        # Jest configuration
├── logs/                    # Application logs
├── docker-compose.yml       # Docker services
├── Dockerfile               # Docker configuration
├── package.json             # Dependencies and scripts
├── jest.config.js           # Jest configuration
├── tsconfig.json            # TypeScript configuration
├── .eslintrc.js             # ESLint configuration
└── README.md                # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the MIT License.
