import { Router } from "express";
import { body, param, query } from "express-validator";
import { UserProvider } from "../providers/userProvider";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";
import { validateRequest } from "../middleware/validationMiddleware";

const router: Router = Router();

// Validation rules
const updateUserValidation = [
  param("id").isMongoId().withMessage("Invalid user ID"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

const paginationValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

// Routes - All routes require authentication
router.use(authMiddleware);

// Get all users (admin only)
router.get(
  "/",
  adminMiddleware,
  paginationValidation,
  validateRequest,
  UserProvider.getAllUsers
);

// Get user by ID
router.get(
  "/:id",
  param("id").isMongoId().withMessage("Invalid user ID"),
  validateRequest,
  UserProvider.getUserById
);

// Update user (admin only)
router.put(
  "/:id",
  adminMiddleware,
  updateUserValidation,
  validateRequest,
  UserProvider.updateUser
);

// Delete user (admin only)
router.delete(
  "/:id",
  adminMiddleware,
  param("id").isMongoId().withMessage("Invalid user ID"),
  validateRequest,
  UserProvider.deleteUser
);

export default router;
