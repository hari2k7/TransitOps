import express from "express";

import {
    createDriver,
    getDrivers,
    getDriverById,
    updateDriver,
    deleteDriver
} from "../controllers/driver.controller.js";

const router = express.Router();

router.get("/", getDrivers);
router.get("/:id", getDriverById);
router.post("/", createDriver);
router.put("/:id", updateDriver);
router.delete("/:id", deleteDriver);

export default router;