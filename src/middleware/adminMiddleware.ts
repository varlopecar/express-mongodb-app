import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    if (user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Access denied. Admin role required",
      });
      return;
    }

    next();
  } catch (error) {
    logger.error("Admin middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during authorization",
    });
  }
};
