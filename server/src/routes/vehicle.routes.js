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

router.get("/", authenticate, getVehicles);

router.get("/:id", authenticate, getVehicle);

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