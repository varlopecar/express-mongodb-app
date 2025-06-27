import { Router } from "express";
import { body } from "express-validator";
import { AuthProvider } from "../providers/authProvider";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validationMiddleware";

const router: Router = Router();

// Validation rules
const registerValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin"),
];

const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

// Routes
router.post(
  "/register",
  registerValidation,
  validateRequest,
  AuthProvider.register
);
router.post("/login", loginValidation, validateRequest, AuthProvider.login);
router.get("/profile", authMiddleware, AuthProvider.getProfile);

export default router;
