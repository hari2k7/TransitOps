import express from "express";

import {
    getAllTrips,
    getTripById,
    createTrip,
    dispatchTrip,
    completeTrip,
    updateTrip,
    cancelTrip,
    deleteTrip
} from "../controllers/trip.controller.js";

import authenticate from "../middleware/auth.js";
import authorize from "../middleware/role.js";
import validate from "../middleware/validate.js";

import { tripValidation } from "../validations/trip.validation.js";

const router = express.Router();

// Dispatcher (edit), Safety Officer (view) — Fleet Manager and Financial
// Analyst both have no trip access per the matrix.
router.get(
    "/",
    authenticate,
    authorize("Dispatcher", "Safety Officer"),
    getAllTrips
);

router.get(
    "/:id",
    authenticate,
    authorize("Dispatcher", "Safety Officer"),
    getTripById
);

router.post(
    "/",
    authenticate,
    authorize("Dispatcher"),
    tripValidation,
    validate,
    createTrip
);

router.put(
    "/:id",
    authenticate,
    authorize("Dispatcher"),
    tripValidation,
    validate,
    updateTrip
);

router.put(
    "/:id/dispatch",
    authenticate,
    authorize("Dispatcher"),
    dispatchTrip
);

router.put(
    "/:id/complete",
    authenticate,
    authorize("Dispatcher"),
    completeTrip
);

router.put(
    "/:id/cancel",
    authenticate,
    authorize("Dispatcher"),
    cancelTrip
);

router.delete(
    "/:id",
    authenticate,
    authorize("Dispatcher"),
    deleteTrip
);

export default router;