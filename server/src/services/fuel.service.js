import pool from "../config/db.js";

export const getAllFuelLogs = async () => {
    const result = await pool.query(
        "SELECT * FROM fuel_logs ORDER BY id"
    );

    return result.rows;
};

export const getFuelLogById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM fuel_logs WHERE id = $1",
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Fuel log not found");
    }

    return result.rows[0];
};

export const createFuelLog = async (fuelData) => {
    const {
        vehicle_id,
        trip_id,
        liters,
        cost,
        log_date
    } = fuelData;

    const vehicleResult = await pool.query(
        "SELECT * FROM vehicles WHERE id = $1",
        [vehicle_id]
    );

    if (vehicleResult.rows.length === 0) {
        throw new Error("Vehicle not found");
    }

    const tripResult = await pool.query(
        "SELECT * FROM trips WHERE id = $1",
        [trip_id]
    );

    if (tripResult.rows.length === 0) {
        throw new Error("Trip not found");
    }

    const result = await pool.query(
        `INSERT INTO fuel_logs
        (vehicle_id, trip_id, liters, cost, log_date)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *`,
        [
            vehicle_id,
            trip_id,
            liters,
            cost,
            log_date
        ]
    );

    return result.rows[0];
};

export const updateFuelLog = async (id, fuelData) => {
    const fuelResult = await pool.query(
        "SELECT * FROM fuel_logs WHERE id = $1",
        [id]
    );

    if (fuelResult.rows.length === 0) {
        throw new Error("Fuel log not found");
    }

    const {
        liters,
        cost,
        log_date
    } = fuelData;

    const result = await pool.query(
        `UPDATE fuel_logs
        SET liters = $1,
            cost = $2,
            log_date = $3
        WHERE id = $4
        RETURNING *`,
        [
            liters,
            cost,
            log_date,
            id
        ]
    );

    return result.rows[0];
};