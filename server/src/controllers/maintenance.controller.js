import pool from "../config/db.js";

// Get all maintenance records
export const getAllMaintenance = async () => {

    const result = await pool.query(`
        SELECT
            m.*,
            v.registration_number,
            v.vehicle_name
        FROM maintenance_logs m
        JOIN vehicles v
            ON m.vehicle_id = v.id
        ORDER BY m.id;
    `);

    return result.rows;
};

// Get maintenance by ID
export const getMaintenanceById = async (id) => {

    const result = await pool.query(
        `
        SELECT
            m.*,
            v.registration_number,
            v.vehicle_name
        FROM maintenance_logs m
        JOIN vehicles v
            ON m.vehicle_id = v.id
        WHERE m.id = $1;
        `,
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Maintenance record not found");
    }

    return result.rows[0];
};

// Create maintenance
export const createMaintenance = async (maintenanceData) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const {
            vehicle_id,
            description,
            cost,
            start_date,
        } = maintenanceData;

        // Check vehicle exists
        const vehicleResult = await client.query(
            "SELECT * FROM vehicles WHERE id = $1",
            [vehicle_id]
        );

        if (vehicleResult.rows.length === 0) {
            throw new Error("Vehicle not found");
        }

        const vehicle = vehicleResult.rows[0];

        // Vehicle must be available
        if (vehicle.status !== "Available") {
            throw new Error(
                `Vehicle is currently ${vehicle.status} and cannot be sent for maintenance`
            );
        }

        // Create maintenance record
        const result = await client.query(
            `
            INSERT INTO maintenance_logs
            (
                vehicle_id,
                description,
                cost,
                start_date
            )
            VALUES
            ($1,$2,$3,$4)
            RETURNING *;
            `,
            [
                vehicle_id,
                description,
                cost,
                start_date,
            ]
        );

        // Update vehicle status
        await client.query(
            `
            UPDATE vehicles
            SET status='In Shop'
            WHERE id=$1;
            `,
            [vehicle_id]
        );

        await client.query("COMMIT");

        return result.rows[0];

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {

        client.release();

    }
};

// Complete maintenance
export const completeMaintenance = async (id) => {

    const maintenanceResult = await pool.query(
        "SELECT * FROM maintenance_logs WHERE id=$1",
        [id]
    );

    if (maintenanceResult.rows.length === 0) {
        throw new Error("Maintenance record not found");
    }

    const maintenance = maintenanceResult.rows[0];

    if (maintenance.status === "Completed") {
        throw new Error("Maintenance already completed");
    }

    await pool.query(
        `
        UPDATE maintenance_logs
        SET
            status='Completed',
            end_date=CURRENT_DATE
        WHERE id=$1;
        `,
        [id]
    );

    await pool.query(
        `
        UPDATE vehicles
        SET status='Available'
        WHERE id=$1;
        `,
        [maintenance.vehicle_id]
    );

    return {
        message: "Maintenance completed successfully",
    };
};

// Update maintenance
export const updateMaintenance = async (id, maintenanceData) => {

    const maintenanceResult = await pool.query(
        "SELECT * FROM maintenance_logs WHERE id=$1",
        [id]
    );

    if (maintenanceResult.rows.length === 0) {
        throw new Error("Maintenance record not found");
    }

    const maintenance = maintenanceResult.rows[0];

    if (maintenance.status !== "Active") {
        throw new Error("Completed maintenance cannot be updated");
    }

    const {
        description,
        cost,
        start_date,
    } = maintenanceData;

    const result = await pool.query(
        `
        UPDATE maintenance_logs
        SET
            description=$1,
            cost=$2,
            start_date=$3
        WHERE id=$4
        RETURNING *;
        `,
        [
            description,
            cost,
            start_date,
            id,
        ]
    );

    return result.rows[0];
};