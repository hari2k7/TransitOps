import pool from "../config/db.js";

// GET ALL EXPENSES
export const getAllExpenses = async () => {
    const result = await pool.query(
        "SELECT * FROM expenses ORDER BY id"
    );

    return result.rows;
};

// GET EXPENSE BY ID
export const getExpenseById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM expenses WHERE id = $1",
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Expense not found");
    }

    return result.rows[0];
};

// CREATE EXPENSE
export const createExpense = async (expenseData) => {
    const {
        vehicle_id,
        expense_type,
        amount,
        description,
        log_date
    } = expenseData;

    const vehicleResult = await pool.query(
        "SELECT * FROM vehicles WHERE id = $1",
        [vehicle_id]
    );

    if (vehicleResult.rows.length === 0) {
        throw new Error("Vehicle not found");
    }

    const result = await pool.query(
        `INSERT INTO expenses
        (vehicle_id, expense_type, amount, description, log_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
            vehicle_id,
            expense_type,
            amount,
            description,
            log_date
        ]
    );

    return result.rows[0];
};

// UPDATE EXPENSE
export const updateExpense = async (id, expenseData) => {
    const expenseResult = await pool.query(
        "SELECT * FROM expenses WHERE id = $1",
        [id]
    );

    if (expenseResult.rows.length === 0) {
        throw new Error("Expense not found");
    }

    const {
        expense_type,
        amount,
        description,
        log_date
    } = expenseData;

    const result = await pool.query(
        `UPDATE expenses
        SET expense_type = $1,
            amount = $2,
            description = $3,
            log_date = $4
        WHERE id = $5
        RETURNING *`,
        [
            expense_type,
            amount,
            description,
            log_date,
            id
        ]
    );

    return result.rows[0];
};