import { body } from "express-validator";

const TRIP_PRIORITIES = ["Low", "Medium", "High"];

export const tripValidation = [
    body("vehicle_id")
        .isInt()
        .withMessage("Vehicle ID is required"),

    body("driver_id")
        .isInt()
        .withMessage("Driver ID is required"),

    body("source")
        .trim()
        .notEmpty()
        .withMessage("Source is required"),

    body("destination")
        .trim()
        .notEmpty()
        .withMessage("Destination is required"),

    body("cargo_weight")
        .isFloat({ gt: 0 })
        .withMessage("Cargo weight must be greater than 0"),

    body("planned_distance")
        .isFloat({ gt: 0 })
        .withMessage("Distance must be greater than 0"),

    body("priority")
        .optional()
        .isIn(TRIP_PRIORITIES)
        .withMessage(`Priority must be one of: ${TRIP_PRIORITIES.join(", ")}`),

    body("expected_delivery")
        .optional({ checkFalsy: true })
        .isDate()
        .withMessage("Expected delivery must be a valid date"),

    body("notes")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Notes must be under 1000 characters")
];