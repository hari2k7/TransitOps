import express from "express";
import {
    getAllFuel,
    getFuel,
    addFuel,
    editFuel
} from "../controllers/fuel.controller.js";

import authenticate from "../middleware/auth.js";
import authorize from "../middleware/role.js";

const router = express.Router();

router.get("/", authenticate, getAllFuel);

router.get("/:id", authenticate, getFuel);

router.post(
    "/",
    authenticate,
    authorize("Fleet Manager", "Financial Analyst"),
    addFuel
);

router.put(
    "/:id",
    authenticate,
    authorize("Fleet Manager", "Financial Analyst"),
    editFuel
);

export default router;