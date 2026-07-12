import express from "express";

import { getAnalytics } from "../controllers/analytics.controller.js";

import authenticate from "../middleware/auth.js";
import authorize from "../middleware/role.js";

const router = express.Router();

router.get(
    "/",
    authenticate,
    authorize("Fleet Manager", "Financial Analyst"),
    getAnalytics
);

export default router;