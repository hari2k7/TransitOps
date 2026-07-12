import { body } from "express-validator";

export const vehicleValidation = [
    body("registration_number")
        .trim()
        .notEmpty()
        .withMessage("Registration number is required"),

    body("vehicle_name")
        .trim()
        .notEmpty()
        .withMessage("Vehicle name is required"),

    body("vehicle_type")
        .trim()
        .notEmpty()
        .withMessage("Vehicle type is required"),

    body("max_capacity")
        .isFloat({ gt: 0 })
        .withMessage("Capacity must be greater than 0"),

    body("odometer")
        .isFloat({ min: 0 })
        .withMessage("Odometer cannot be negative"),

    body("acquisition_cost")
        .isFloat({ min: 0 })
        .withMessage("Acquisition cost cannot be negative"),

    body("region")
        .trim()
        .notEmpty()
        .withMessage("Region is required"),
];