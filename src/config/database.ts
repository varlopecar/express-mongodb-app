import mongoose from "mongoose";
import logger from "./logger";

let isConnected = false;

const connectDB = async (): Promise<void> => {
  // Check if mongoose is already connected
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    logger.info("MongoDB already connected (readyState check)");
    return;
  }

  if (isConnected) {
    logger.info("MongoDB already connected");
    return;
  }

  try {
    const mongoURI = process.env["MONGODB_URI"] || "mongodb://localhost:27017/express-app";
    
    // Check if we're in a serverless environment
    const isServerless = process.env['VERCEL'] || process.env['AWS_LAMBDA_FUNCTION_NAME'];
    
    const options = {
  maxPoolSize: isServerless ? 1 : 10, // Reduce pool size for serverless
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: true, // Enable buffering to handle connection delays
  // Add retryWrites for better reliability
  retryWrites: true,
  // Add write concern for better durability
  w: 'majority' as const,
  // Add connection timeout
  connectTimeoutMS: 10000,
};

    // Add specific options for Atlas connections
    if (mongoURI.includes('mongodb.net')) {
      options.retryWrites = true;
      options.w = 'majority' as const;
      
      // For serverless environments, add additional options
      if (isServerless) {
        options.maxPoolSize = 1;
        // Keep bufferCommands true for better reliability
      }
    }

    await mongoose.connect(mongoURI, options);

    isConnected = true;
    logger.info("MongoDB connected successfully");

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
      isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
      isConnected = false;
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (error) {
    logger.error("MongoDB connection failed:", error);
    isConnected = false;
    throw error;
  }
};

// Function to check if database is connected
export const isDBConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

// Function to ensure database is ready
export const ensureDBConnection = async (): Promise<void> => {
  if (!isDBConnected()) {
    await connectDB();
  }
};

export default connectDB;
