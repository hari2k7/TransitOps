import pool from "../config/db.js";

// Get all vehicles
export const getAllVehicles = async () => {
    const result = await pool.query(`
        SELECT *
        FROM vehicles
        ORDER BY id ASC
    `);

    return result.rows;
};

// Get vehicle by ID
export const getVehicleById = async (id) => {
    const result = await pool.query(
        `SELECT * FROM vehicles WHERE id = $1`,
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Vehicle not found");
    }

    return result.rows[0];
};

// Create vehicle
export const createVehicle = async (vehicleData) => {
    const {
        registration_number,
        vehicle_name,
        vehicle_type,
        max_capacity,
        odometer,
        acquisition_cost,
        region,
    } = vehicleData;

    // Check duplicate registration number
    const existing = await pool.query(
        `SELECT id FROM vehicles WHERE registration_number = $1`,
        [registration_number]
    );

    if (existing.rows.length > 0) {
        throw new Error("Vehicle already exists");
    }

    const result = await pool.query(
        `
        INSERT INTO vehicles
        (
            registration_number,
            vehicle_name,
            vehicle_type,
            max_capacity,
            odometer,
            acquisition_cost,
            region
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *;
        `,
        [
            registration_number,
            vehicle_name,
            vehicle_type,
            max_capacity,
            odometer,
            acquisition_cost,
            region,
        ]
    );

    return result.rows[0];
};

// Update vehicle
export const updateVehicle = async (id, vehicleData) => {
    const {
        registration_number,
        vehicle_name,
        vehicle_type,
        max_capacity,
        odometer,
        acquisition_cost,
        status,
        region,
    } = vehicleData;

    const result = await pool.query(
        `
        UPDATE vehicles
        SET
            registration_number=$1,
            vehicle_name=$2,
            vehicle_type=$3,
            max_capacity=$4,
            odometer=$5,
            acquisition_cost=$6,
            status=$7,
            region=$8
        WHERE id=$9
        RETURNING *;
        `,
        [
            registration_number,
            vehicle_name,
            vehicle_type,
            max_capacity,
            odometer,
            acquisition_cost,
            status,
            region,
            id,
        ]
    );

    if (result.rows.length === 0) {
        throw new Error("Vehicle not found");
    }

    return result.rows[0];
};

// Delete vehicle
export const deleteVehicle = async (id) => {
    const result = await pool.query(
        `
        DELETE FROM vehicles
        WHERE id=$1
        RETURNING *;
        `,
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Vehicle not found");
    }

    return result.rows[0];
};