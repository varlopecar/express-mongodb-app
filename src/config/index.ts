import dotenv from "dotenv";

// Load environment variables
dotenv.config();

interface Config {
  nodeEnv: string;
  port: number;
  mongoURI: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  logLevel: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  corsOrigin: string | string[];
}

const config: Config = {
  nodeEnv: process.env["NODE_ENV"] || "development",
  port: parseInt(process.env["PORT"] || "3001", 10),
  mongoURI: process.env["MONGODB_URI"] || "mongodb://localhost:27017/blog-api",
  jwtSecret:
    process.env["JWT_SECRET"] ||
    "your-super-secret-jwt-key-change-this-in-production",
  jwtExpiresIn: process.env["JWT_EXPIRES_IN"] || "24h",
  logLevel: process.env["LOG_LEVEL"] || "info",
  rateLimitWindowMs: parseInt(
    process.env["RATE_LIMIT_WINDOW_MS"] || "900000",
    10
  ),
  rateLimitMaxRequests: parseInt(
    process.env["RATE_LIMIT_MAX_REQUESTS"] || "100",
    10
  ),
  corsOrigin: process.env["CORS_ORIGIN"]
    ? process.env["CORS_ORIGIN"].split(",")
    : ["http://localhost:3000", "https://varlopecar.github.io"],
};

export default config;
