import { body } from "express-validator";

export const fuelValidation = [
    body("vehicle_id")
        .isInt({ gt: 0 })
        .withMessage("Valid vehicle ID is required"),

    // Nullable — the frontend fuel form doesn't collect a trip.
    body("trip_id")
        .optional({ checkFalsy: true })
        .isInt({ gt: 0 })
        .withMessage("Valid trip ID is required"),

    body("liters")
        .isFloat({ gt: 0 })
        .withMessage("Liters must be greater than 0"),

    body("cost")
        .isFloat({ min: 0 })
        .withMessage("Cost cannot be negative"),

    body("log_date")
        .isDate()
        .withMessage("Valid log date is required"),
];
