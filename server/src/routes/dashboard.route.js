import express from "express";

import { getDashboard, getRecentTrips } from "../controllers/dashboard.controller.js";

import authenticate from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, getDashboard);
router.get("/recent-trips", authenticate, getRecentTrips);

export default router;