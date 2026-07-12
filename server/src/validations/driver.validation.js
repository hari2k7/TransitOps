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
        .isIn(["LMV", "HMV"])
        .withMessage("License category must be LMV or HMV"),

    body("license_expiry")
        .isDate()
        .withMessage("Valid expiry date is required"),

    body("contact_number")
        .matches(/^[0-9]{10}$/)
        .withMessage("Contact number must be 10 digits"),

    // Only present on update (create defaults to 100 in the DB), so this
    // shouldn't be required — but if it IS sent, it must be a valid score.
    body("safety_score")
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage("Safety score must be between 0 and 100"),

    body("status")
        .optional()
        .isIn(["Available", "On Trip", "Off Duty", "Suspended"])
        .withMessage("Invalid driver status"),
];