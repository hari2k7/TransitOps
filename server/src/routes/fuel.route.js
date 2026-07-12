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

// Financial Analyst is the only role with any fuel-log access per the matrix.
router.get("/", authenticate, authorize("Financial Analyst"), getAllFuel);

router.get("/:id", authenticate, authorize("Financial Analyst"), getFuel);

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