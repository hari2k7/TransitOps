import express from "express";

import {
    register,
    login,
    listRoles,
} from "../controllers/auth.controller.js";

import validate from "../middleware/validate.js";

import {
    registerValidation,
    loginValidation,
} from "../validations/auth.validation.js";

const router = express.Router();

// Public — no auth required, needed before a user has an account/token.
router.get("/roles", listRoles);

router.post(
    "/register",
    registerValidation,
    validate,
    register
);

router.post(
    "/login",
    loginValidation,
    validate,
    login
);

export default router;