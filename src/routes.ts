import { Router } from "express";
import postRoutes from "./controllers/postController";

const router = Router();

// Blog post routes
router.use("/posts", postRoutes);

// Health check endpoint
router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Blog API Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env["NODE_ENV"] || "development",
  });
});

// Root endpoint
router.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Blog API - Welcome to the Blog Posts API",
    version: "1.0.0",
    endpoints: {
      posts: "/posts",
      health: "/health",
    },
  });
});

export default router;
