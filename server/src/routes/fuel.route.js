import express from "express";
import {
    getAllFuel,
    getFuel,
    addFuel,
    editFuel
} from "../controllers/fuel.controller.js";

import authenticate from "../middleware/auth.js";
import authorize from "../middleware/role.js";
import validate from "../middleware/validate.js";

import { fuelValidation } from "../validations/fuel.validation.js";

const router = express.Router();

router.get("/", authenticate, getAllFuel);

router.get("/:id", authenticate, getFuel);

router.post(
    "/",
    authenticate,
    authorize("Financial Analyst"),
    fuelValidation,
    validate,
    addFuel
);

router.put(
    "/:id",
    authenticate,
    authorize("Financial Analyst"),
    fuelValidation,
    validate,
    editFuel
);

export default router;