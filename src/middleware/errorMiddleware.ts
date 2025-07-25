import { Request, Response } from "express";
import logger from "../config/logger";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
): void => {
  let { statusCode = 500, message } = err;

  // Log error
  logger.error("Error occurred:", {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
  }

  // Mongoose duplicate key error
  if (err.name === "MongoError" && (err as { code?: number }).code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  // Mongoose cast error
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  res.status(statusCode).json({
    success: false,
    message:
      process.env["NODE_ENV"] === "production" ? "Internal server error" : message,
    ...(process.env["NODE_ENV"] !== "production" && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};
