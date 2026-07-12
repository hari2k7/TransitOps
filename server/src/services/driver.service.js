import pool from "../config/db.js";

// Get all drivers
export const getAllDrivers = async () => {
    const result = await pool.query(`
        SELECT *
        FROM drivers
        ORDER BY id ASC
    `);

    return result.rows;
};

// Get driver by ID
export const getDriverById = async (id) => {
    const result = await pool.query(
        `SELECT * FROM drivers WHERE id = $1`,
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Driver not found");
    }

    return result.rows[0];
};

// Create driver
export const createDriver = async (driverData) => {
    const {
        name,
        license_number,
        license_category,
        license_expiry,
        contact_number,
    } = driverData;

    // Check duplicate license number
    const existing = await pool.query(
        `SELECT id FROM drivers WHERE license_number = $1`,
        [license_number]
    );

    if (existing.rows.length > 0) {
        throw new Error("License number already exists");
    }

    const result = await pool.query(
        `
        INSERT INTO drivers
        (
            name,
            license_number,
            license_category,
            license_expiry,
            contact_number
        )
        VALUES
        ($1,$2,$3,$4,$5)
        RETURNING *;
        `,
        [
            name,
            license_number,
            license_category,
            license_expiry,
            contact_number,
        ]
    );

    return result.rows[0];
};

// Update driver
export const updateDriver = async (id, driverData) => {
    const {
        name,
        license_number,
        license_category,
        license_expiry,
        contact_number,
        safety_score,
        status,
    } = driverData;

    // Prevent duplicate license numbers
    const existing = await pool.query(
        `
        SELECT id
        FROM drivers
        WHERE license_number = $1
        AND id != $2
        `,
        [license_number, id]
    );

    if (existing.rows.length > 0) {
        throw new Error("License number already exists");
    }

    const result = await pool.query(
        `
        UPDATE drivers
        SET
            name = $1,
            license_number = $2,
            license_category = $3,
            license_expiry = $4,
            contact_number = $5,
            safety_score = $6,
            status = $7
        WHERE id = $8
        RETURNING *;
        `,
        [
            name,
            license_number,
            license_category,
            license_expiry,
            contact_number,
            safety_score,
            status,
            id,
        ]
    );

    if (result.rows.length === 0) {
        throw new Error("Driver not found");
    }

    return result.rows[0];
};

// Delete driver
export const deleteDriver = async (id) => {
    const result = await pool.query(
        `
        DELETE FROM drivers
        WHERE id = $1
        RETURNING *;
        `,
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Driver not found");
    }

    return result.rows[0];
};