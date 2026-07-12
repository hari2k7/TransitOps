import * as expenseService from "../services/expense.service.js";

// GET ALL EXPENSES
export const getAllExpenses = async (req, res) => {
    try {
        const expenses = await expenseService.getAllExpenses();

        res.status(200).json(expenses);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// GET EXPENSE BY ID
export const getExpense = async (req, res) => {
    try {
        const expense = await expenseService.getExpenseById(req.params.id);

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json(expense);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// CREATE EXPENSE
export const addExpense = async (req, res) => {
    try {
        const expense = await expenseService.createExpense(req.body);

        res.status(201).json({
            message: "Expense created successfully",
            expense
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// UPDATE EXPENSE
export const editExpense = async (req, res) => {
    try {
        const expense = await expenseService.updateExpense(
            req.params.id,
            req.body
        );

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json({
            message: "Expense updated successfully",
            expense
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};