import winston from "winston";

// Check if we're in a serverless environment (Vercel, AWS Lambda, etc.)
const isServerless = process.env["VERCEL"] || process.env["AWS_LAMBDA_FUNCTION_NAME"];

const logger = winston.createLogger({
  level: process.env["LOG_LEVEL"] || "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "express-app" },
  transports: [
    // Always use console transport for serverless environments
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Add file transports only for non-serverless environments
if (!isServerless && process.env["NODE_ENV"] !== "production") {
  logger.add(new winston.transports.File({ filename: "logs/error.log", level: "error" }));
  logger.add(new winston.transports.File({ filename: "logs/combined.log" }));
}

export default logger;
