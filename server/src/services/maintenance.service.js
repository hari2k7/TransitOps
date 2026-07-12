import pool from "../db.js";

export const getAllMaintenance = async () => {
    const result = await pool.query(
        "SELECT * FROM maintenance_logs ORDER BY id"
    );

    return result.rows;
};

export const getMaintenanceById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM maintenance_logs WHERE id = $1",
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Maintenance record not found");
    }

    return result.rows[0];
};

export const createMaintenance = async (maintenanceData) => {
    const {
        vehicle_id,
        description,
        cost,
        start_date
    } = maintenanceData;

    const vehicleResult = await pool.query(
        "SELECT * FROM vehicles WHERE id = $1",
        [vehicle_id]
    );

    if (vehicleResult.rows.length === 0) {
        throw new Error("Vehicle not found");
    }

    await pool.query(
        "UPDATE vehicles SET status = 'In Shop' WHERE id = $1",
        [vehicle_id]
    );

    const result = await pool.query(
        `INSERT INTO maintenance_logs
        (vehicle_id, description, cost, start_date)
        VALUES ($1,$2,$3,$4)
        RETURNING *`,
        [
            vehicle_id,
            description,
            cost,
            start_date
        ]
    );

    return result.rows[0];
};

export const completeMaintenance = async (id) => {
    const maintenanceResult = await pool.query(
        "SELECT * FROM maintenance_logs WHERE id = $1",
        [id]
    );

    if (maintenanceResult.rows.length === 0) {
        throw new Error("Maintenance record not found");
    }

    const maintenance = maintenanceResult.rows[0];

    await pool.query(
        `UPDATE maintenance_logs
         SET status='Completed',
             end_date=CURRENT_DATE
         WHERE id=$1`,
        [id]
    );

    await pool.query(
        "UPDATE vehicles SET status='Available' WHERE id=$1",
        [maintenance.vehicle_id]
    );

    return { message: "Maintenance completed successfully" };
};

export const updateMaintenance = async (id, maintenanceData) => {
    const maintenanceResult = await pool.query(
        "SELECT * FROM maintenance_logs WHERE id = $1",
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
        start_date
    } = maintenanceData;

    const result = await pool.query(
        `UPDATE maintenance_logs
        SET description=$1,
            cost=$2,
            start_date=$3
        WHERE id=$4
        RETURNING *`,
        [
            description,
            cost,
            start_date,
            id
        ]
    );

    return result.rows[0];
};