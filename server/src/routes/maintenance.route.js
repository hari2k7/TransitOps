import express from "express";

import {
    getAllMaintenance,
    getMaintenanceById,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance,
    completeMaintenance,
} from "../controllers/maintenance.controller.js";

import authenticate from "../middleware/auth.js";
import authorize from "../middleware/role.js";
import validate from "../middleware/validate.js";

import { maintenanceValidation } from "../validations/maintenance.validation.js";

const router = express.Router();

// Fleet Manager (edit), Dispatcher (view), Financial Analyst (view) — Safety
// Officer has no maintenance access per the matrix.
router.get(
    "/",
    authenticate,
    authorize("Fleet Manager", "Dispatcher", "Financial Analyst"),
    getAllMaintenance
);

router.get(
    "/:id",
    authenticate,
    authorize("Fleet Manager", "Dispatcher", "Financial Analyst"),
    getMaintenanceById
);

router.post(
    "/",
    authenticate,
    authorize("Fleet Manager"),
    maintenanceValidation,
    validate,
    createMaintenance
);

router.put(
    "/:id",
    authenticate,
    authorize("Fleet Manager"),
    maintenanceValidation,
    validate,
    updateMaintenance
);

router.delete(
    "/:id",
    authenticate,
    authorize("Fleet Manager"),
    deleteMaintenance
);

router.patch(
    "/:id/complete",
    authenticate,
    authorize("Fleet Manager"),
    completeMaintenance
);

export default router;