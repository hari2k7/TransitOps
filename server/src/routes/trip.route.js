import express from "express";

import {
    getAllTrips,
    getTripById,
    createTrip,
    dispatchTrip,
    completeTrip,
    updateTrip,
    cancelTrip
} from "../controllers/trip.controller.js";

import authenticate from "../middleware/auth.js";
import authorize from "../middleware/role.js";
import validate from "../middleware/validate.js";

import { tripValidation } from "../validations/trip.validation.js";

const router = express.Router();

router.get(
    "/",
    authenticate,
    getAllTrips
);

router.get(
    "/:id",
    authenticate,
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

export default router;