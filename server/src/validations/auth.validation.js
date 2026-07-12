import { body } from "express-validator";

export const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain one uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain one lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain one number")
        .matches(/[!@#$%^&*]/)
        .withMessage("Password must contain one special character"),

    body("role_id")
        .isInt({ min: 1 })
        .withMessage("Invalid role"),
];

export const loginValidation = [
    body("email")
        .isEmail()
        .withMessage("Invalid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];