# Blog API - Node.js + MongoDB

A RESTful API for managing blog posts built with Express.js, TypeScript, and MongoDB. This API serves as the backend for the React frontend's blog functionality.

## Features

- **Blog Post Management**: Create, read, update, and delete blog posts
- **RESTful API**: Full CRUD operations for blog posts
- **Validation**: Input validation using express-validator
- **Error Handling**: Comprehensive error handling and logging
- **CORS Support**: Configured for cross-origin requests from React frontend
- **Rate Limiting**: Protection against abuse
- **Security**: Helmet for security headers
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

# Test API endpoints
pnpm run test:apis
```

## Testing

The project includes comprehensive testing:

### Unit Tests
- Service layer tests
- Utility function tests

### Integration Tests
- API endpoint tests
- Database integration tests

### Test Coverage
- Run `pnpm run test:coverage` to generate coverage reports
- Coverage reports are generated in the `coverage/` directory

## API Testing

Use the built-in API testing script:

```bash
# Test all API endpoints
pnpm run test:apis
```

This script will:
- Test all CRUD operations
- Validate error handling
- Test input validation
- Clean up test data

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
│   │   └── postController.ts # Blog post endpoints
│   ├── models/              # Database models
│   │   ├── Post.ts          # Blog post model
│   │   └── index.ts         # Model exports
│   ├── middleware/          # Express middleware
│   │   ├── errorMiddleware.ts # Error handling
│   │   └── validationMiddleware.ts # Input validation
│   ├── config/              # Configuration files
│   │   ├── database.ts      # Database configuration
│   │   ├── logger.ts        # Logging configuration
│   │   └── index.ts         # Config exports
│   ├── scripts/             # Utility scripts
│   │   ├── seed.ts          # Database seeding
│   │   └── test-apis.ts     # API testing
│   ├── app.ts               # Express app setup
│   ├── routes.ts            # Route definitions
│   └── server.ts            # Server entry point
├── test/                    # Test files
│   ├── post.test.ts         # Post API tests
│   ├── setup.ts             # Test setup
│   └── jest.setup.js        # Jest configuration
├── docker-compose.yml       # Docker services
├── Dockerfile               # Application container
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── jest.config.js           # Jest test configuration
└── README.md                # Project documentation
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
