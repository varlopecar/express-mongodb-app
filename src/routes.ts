import { Router } from "express";
import authRoutes from "./controllers/authController";
import userRoutes from "./controllers/userController";

const router = Router();

// API routes
router.use("/api/auth", authRoutes);
router.use("/api/users", userRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

export default router;
