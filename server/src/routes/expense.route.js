import express from "express";

import {
    getAllExpenses,
    getExpense,
    addExpense,
    editExpense
} from "../controllers/expense.controller.js";

import authenticate from "../middleware/auth.js";
import authorize from "../middleware/role.js";
import validate from "../middleware/validate.js";

import { expenseValidation } from "../validations/expense.validation.js";

const router = express.Router();

router.get("/", authenticate, getAllExpenses);

router.get("/:id", authenticate, getExpense);

router.post(
    "/",
    authenticate,
    authorize("Financial Analyst"),
    expenseValidation,
    validate,
    addExpense
);

router.put(
    "/:id",
    authenticate,
    authorize("Financial Analyst"),
    expenseValidation,
    validate,
    editExpense
);

export default router;