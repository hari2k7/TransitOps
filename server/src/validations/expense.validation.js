import { body } from "express-validator";

// Must match the `expense_type` Postgres enum in database/schema.sql exactly.
const EXPENSE_TYPES = ["Toll", "Parking", "Insurance", "Repair", "Other"];

export const expenseValidation = [
    body("vehicle_id")
        .isInt({ gt: 0 })
        .withMessage("Valid vehicle ID is required"),

    body("expense_type")
        .isIn(EXPENSE_TYPES)
        .withMessage(`Expense type must be one of: ${EXPENSE_TYPES.join(", ")}`),

    body("amount")
        .isFloat({ min: 0 })
        .withMessage("Amount cannot be negative"),

    body("description")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description must be under 500 characters"),

    body("log_date")
        .isDate()
        .withMessage("Valid log date is required"),
];
