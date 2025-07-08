import express from "express";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import config from "./config";
import connectDB from "./config/database";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware";
import logger from "./config/logger";

const app: express.Application = express();

// Trust the first proxy (required for correct client IP detection on Vercel, Heroku, etc.)
app.set('trust proxy', 1);

// Connect to MongoDB (skip in test environment)
if (process.env["NODE_ENV"] !== "test") {
  connectDB().then(() => {
    logger.info("Database connection established");
  }).catch((error) => {
    logger.error("Failed to connect to database:", error);
  });
}

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/", limiter);

// Compression middleware (gzip)
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });
  next();
});

// Database connection check middleware (skip for health check and root)
app.use((req, _res, next) => {
  if (req.path === '/health' || req.path === '/') {
    return next();
  }
  
  // Allow requests to proceed - let individual controllers handle connection
  // The ensureDBConnection() function in controllers will handle connection issues
  next();
});

// Routes
app.use(routes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
