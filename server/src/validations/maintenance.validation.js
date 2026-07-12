import { body } from "express-validator";

const MAINTENANCE_TYPES = ["Routine Service", "Repair", "Inspection", "Tire Change"];
const MAINTENANCE_STATUSES = ["Scheduled", "In Progress", "Completed", "Cancelled"];

export const maintenanceValidation = [

    body("vehicle_id")
        .isInt({ gt: 0 })
        .withMessage("Valid vehicle ID is required"),

    body("type")
        .optional()
        .isIn(MAINTENANCE_TYPES)
        .withMessage(`Type must be one of: ${MAINTENANCE_TYPES.join(", ")}`),

    // No longer required — the frontend form doesn't force a description.
    body("description")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 5, max: 500 })
        .withMessage("Description must be between 5 and 500 characters"),

    body("cost")
        .isFloat({ min: 0 })
        .withMessage("Cost must be a positive number"),

    body("start_date")
        .isDate()
        .withMessage("Valid start date is required"),

    body("status")
        .optional()
        .isIn(MAINTENANCE_STATUSES)
        .withMessage(`Status must be one of: ${MAINTENANCE_STATUSES.join(", ")}`),

];
