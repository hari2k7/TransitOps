import express from "express";

import {
    register,
    login,
} from "../controllers/auth.controller.js";

import validate from "../middleware/validate.js";

import {
    registerValidation,
    loginValidation,
} from "../validations/auth.validation.js";

const router = express.Router();

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