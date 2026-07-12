import { body } from "express-validator";

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
        .withMessage("Distance must be greater than 0")
];