import app from "./app";
import config from "./config";
import logger from "./config/logger";

const server = app.listen(config.port, () => {
  logger.info(
    `Server running in ${config.nodeEnv} mode on port ${config.port}`
  );
  logger.info(
    `Health check available at http://localhost:${config.port}/health`
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  logger.error("Unhandled Promise Rejection:", err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  logger.error("Uncaught Exception:", err);
  server.close(() => {
    process.exit(1);
  });
});

export default server;
