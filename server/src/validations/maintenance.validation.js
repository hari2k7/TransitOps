import { body } from "express-validator";

export const maintenanceValidation = [

    body("vehicle_id")
        .isInt({ gt: 0 })
        .withMessage("Valid vehicle ID is required"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 5, max: 500 })
        .withMessage("Description must be between 5 and 500 characters"),

    body("cost")
        .isFloat({ min: 0 })
        .withMessage("Cost must be a positive number"),

    body("start_date")
        .isDate()
        .withMessage("Valid start date is required"),

];