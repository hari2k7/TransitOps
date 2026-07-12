import express from "express";

import {
    getAllMaintenance,
    getMaintenanceById,
    createMaintenance,
    updateMaintenance,
    completeMaintenance,
} from "../controllers/maintenance.controller.js";

import authenticate from "../middleware/auth.js";
import authorize from "../middleware/role.js";
import validate from "../middleware/validate.js";

import { maintenanceValidation } from "../validations/maintenance.validation.js";

const router = express.Router();

router.get(
    "/",
    authenticate,
    getAllMaintenance
);

router.get(
    "/:id",
    authenticate,
    getMaintenanceById
);

router.post(
    "/",
    authenticate,
    authorize("Safety Officer"),
    maintenanceValidation,
    validate,
    createMaintenance
);

router.put(
    "/:id",
    authenticate,
    authorize("Safety Officer"),
    maintenanceValidation,
    validate,
    updateMaintenance
);

router.patch(
    "/:id/complete",
    authenticate,
    authorize("Safety Officer"),
    completeMaintenance
);

export default router;