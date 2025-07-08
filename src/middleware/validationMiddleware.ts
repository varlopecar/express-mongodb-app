import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: (error as { path?: string }).path,
        message: (error as { msg?: string }).msg,
        value: (error as { value?: unknown }).value,
      })),
    });
    return;
  }

  next();
};
