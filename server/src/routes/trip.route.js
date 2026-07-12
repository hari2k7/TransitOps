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
    authorize("Driver", "Fleet Manager"),
    createTrip
);

router.put(
    "/:id",
    authenticate,
    authorize("Driver", "Fleet Manager"),
    updateTrip
);

router.put(
    "/:id/dispatch",
    authenticate,
    authorize("Driver", "Fleet Manager"),
    dispatchTrip
);

router.put(
    "/:id/complete",
    authenticate,
    authorize("Driver", "Fleet Manager"),
    completeTrip
);

router.put(
    "/:id/cancel",
    authenticate,
    authorize("Driver", "Fleet Manager"),
    cancelTrip
);

export default router;