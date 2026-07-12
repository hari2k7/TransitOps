import * as expenseService from "../services/expense.service.js";

// GET ALL EXPENSES
export const getAllExpenses = async (req, res) => {
    try {
        const expenses = await expenseService.getAllExpenses();

        res.status(200).json({ success: true, data: expenses });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET EXPENSE BY ID
export const getExpense = async (req, res) => {
    try {
        const expense = await expenseService.getExpenseById(req.params.id);

        res.status(200).json({ success: true, data: expense });

    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
};

// CREATE EXPENSE
export const addExpense = async (req, res) => {
    try {
        const expense = await expenseService.createExpense(req.body);

        res.status(201).json({
            success: true,
            message: "Expense created successfully",
            data: expense,
        });

    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// UPDATE EXPENSE
export const editExpense = async (req, res) => {
    try {
        const expense = await expenseService.updateExpense(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            data: expense,
        });

    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
