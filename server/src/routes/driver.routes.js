import express from "express";

import {
    getDrivers,
    getDriver,
    createDriverController,
    updateDriverController,
    deleteDriverController,
} from "../controllers/driver.controller.js";

import authenticate from "../middleware/auth.js";
import authorize from "../middleware/role.js";
import validate from "../middleware/validate.js";

import { driverValidation } from "../validations/driver.validation.js";

const router = express.Router();

// All authenticated users
router.get("/", authenticate, getDrivers);

router.get("/:id", authenticate, getDriver);

// Fleet Manager only
router.post(
    "/",
    authenticate,
    authorize("Fleet Manager"),
    driverValidation,
    validate,
    createDriverController
);

router.put(
    "/:id",
    authenticate,
    authorize("Fleet Manager"),
    driverValidation,
    validate,
    updateDriverController
);

router.delete(
    "/:id",
    authenticate,
    authorize("Fleet Manager"),
    deleteDriverController
);

export default router;