import { body } from "express-validator";

export const driverValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Driver name is required"),

    body("license_number")
        .trim()
        .notEmpty()
        .withMessage("License number is required"),

    body("license_category")
        .trim()
        .notEmpty()
        .withMessage("License category is required"),

    body("license_expiry")
        .isDate()
        .withMessage("Valid expiry date is required"),

    body("contact_number")
        .matches(/^[0-9]{10}$/)
        .withMessage("Contact number must be 10 digits")
];