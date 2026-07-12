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

// Only Fleet Manager and Safety Officer have any driver access per the
// matrix — Dispatcher and Financial Analyst are both 'none'.
router.get(
    "/",
    authenticate,
    authorize("Fleet Manager", "Safety Officer"),
    getDrivers
);

router.get(
    "/:id",
    authenticate,
    authorize("Fleet Manager", "Safety Officer"),
    getDriver
);

// Fleet Manager and Safety Officer both have edit access to drivers
// (per the confirmed RBAC matrix).
router.post(
    "/",
    authenticate,
    authorize("Fleet Manager", "Safety Officer"),
    driverValidation,
    validate,
    createDriverController
);

router.put(
    "/:id",
    authenticate,
    authorize("Fleet Manager", "Safety Officer"),
    driverValidation,
    validate,
    updateDriverController
);

router.delete(
    "/:id",
    authenticate,
    authorize("Fleet Manager", "Safety Officer"),
    deleteDriverController
);

export default router;