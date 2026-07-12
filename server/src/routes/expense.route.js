import express from "express";

import {
    getAllExpenses,
    getExpense,
    addExpense,
    editExpense
} from "../controllers/expense.controller.js";

import authenticate from "../middleware/auth.js";
import authorize from "../middleware/role.js";

const router = express.Router();

router.get("/", authenticate, getAllExpenses);

router.get("/:id", authenticate, getExpense);

router.post(
    "/",
    authenticate,
    authorize("Fleet Manager", "Financial Analyst"),
    addExpense
);

router.put(
    "/:id",
    authenticate,
    authorize("Fleet Manager", "Financial Analyst"),
    editExpense
);

export default router;