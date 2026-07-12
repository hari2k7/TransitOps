import express from "express";

import {
    getVehicles,
    getVehicle,
    createVehicleController,
    updateVehicleController,
    deleteVehicleController,
} from "../controllers/vehicle.controller.js";

import authenticate from "../middleware/auth.js";
import authorize from "../middleware/role.js";
import validate from "../middleware/validate.js";

import { vehicleValidation } from "../validations/vehicle.validation.js";

const router = express.Router();

// Fleet Manager (edit), Dispatcher (view), Financial Analyst (view) — Safety
// Officer has no fleet access at all per the matrix.
router.get(
    "/",
    authenticate,
    authorize("Fleet Manager", "Dispatcher", "Financial Analyst"),
    getVehicles
);

router.get(
    "/:id",
    authenticate,
    authorize("Fleet Manager", "Dispatcher", "Financial Analyst"),
    getVehicle
);

router.post(
    "/",
    authenticate,
    authorize("Fleet Manager"),
    vehicleValidation,
    validate,
    createVehicleController
);

router.put(
    "/:id",
    authenticate,
    authorize("Fleet Manager"),
    vehicleValidation,
    validate,
    updateVehicleController
);

router.delete(
    "/:id",
    authenticate,
    authorize("Fleet Manager"),
    deleteVehicleController
);
export default router;