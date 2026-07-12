import pool from "../config/db.js";

// Keep the vehicle's status in sync with its maintenance record: work
// actually starting ('In Progress') takes the vehicle 'In Shop'; finishing
// either way ('Completed' or 'Cancelled') frees it back up. 'Scheduled'
// doesn't touch the vehicle yet. Mirrors client/src/services/maintenanceService.js.
async function syncVehicleStatus(client, vehicleId, maintenanceStatus) {
    if (maintenanceStatus === "In Progress") {
        await client.query(
            "UPDATE vehicles SET status='In Shop' WHERE id=$1",
            [vehicleId]
        );
    } else if (maintenanceStatus === "Completed" || maintenanceStatus === "Cancelled") {
        await client.query(
            "UPDATE vehicles SET status='Available' WHERE id=$1",
            [vehicleId]
        );
    }
}

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
            type,
            description,
            cost,
            start_date,
            status,
        } = maintenanceData;

        // Check vehicle exists
        const vehicleResult = await client.query(
            "SELECT * FROM vehicles WHERE id = $1",
            [vehicle_id]
        );

        if (vehicleResult.rows.length === 0) {
            throw new Error("Vehicle not found");
        }

        const recordStatus = status || "Scheduled";

        // Create maintenance record
        const result = await client.query(
            `
            INSERT INTO maintenance_logs
            (
                vehicle_id,
                type,
                description,
                cost,
                start_date,
                status
            )
            VALUES
            ($1,$2,$3,$4,$5,$6)
            RETURNING *;
            `,
            [
                vehicle_id,
                type,
                description || null,
                cost,
                start_date,
                recordStatus,
            ]
        );

        // Only affects the vehicle once work actually starts (or finishes).
        await syncVehicleStatus(client, vehicle_id, recordStatus);

        await client.query("COMMIT");

        return result.rows[0];

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {

        client.release();

    }
};

// Update maintenance — status can move freely between Scheduled / In
// Progress / Completed / Cancelled (matches the frontend's edit modal,
// which lets any record be re-opened regardless of its current status).
export const updateMaintenance = async (id, maintenanceData) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const maintenanceResult = await client.query(
            "SELECT * FROM maintenance_logs WHERE id=$1",
            [id]
        );

        if (maintenanceResult.rows.length === 0) {
            throw new Error("Maintenance record not found");
        }

        const {
            vehicle_id,
            type,
            description,
            cost,
            start_date,
            status,
        } = maintenanceData;

        const result = await client.query(
            `
            UPDATE maintenance_logs
            SET
                vehicle_id=$1,
                type=$2,
                description=$3,
                cost=$4,
                start_date=$5,
                status=$6,
                end_date=CASE
                    WHEN $6 IN ('Completed','Cancelled') THEN CURRENT_DATE
                    ELSE end_date
                END
            WHERE id=$7
            RETURNING *;
            `,
            [
                vehicle_id,
                type,
                description || null,
                cost,
                start_date,
                status,
                id,
            ]
        );

        await syncVehicleStatus(client, vehicle_id, status);

        await client.query("COMMIT");

        return result.rows[0];

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {

        client.release();

    }
};

// New — the frontend Maintenance page has a permanent delete action that
// had no backend counterpart (no DELETE route existed at all before).
export const deleteMaintenance = async (id) => {

    const result = await pool.query(
        "DELETE FROM maintenance_logs WHERE id=$1 RETURNING *",
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Maintenance record not found");
    }

    return result.rows[0];
};

// Complete maintenance — optional convenience endpoint, not currently used
// by the frontend (which edits status via the form directly), kept for any
// future "mark complete" quick-action.
export const completeMaintenance = async (id) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const maintenanceResult = await client.query(
            "SELECT * FROM maintenance_logs WHERE id=$1",
            [id]
        );

        if (maintenanceResult.rows.length === 0) {
            throw new Error("Maintenance record not found");
        }

        const maintenance = maintenanceResult.rows[0];

        if (["Completed", "Cancelled"].includes(maintenance.status)) {
            throw new Error(`Maintenance is already ${maintenance.status.toLowerCase()}`);
        }

        await client.query(
            `
            UPDATE maintenance_logs
            SET
                status='Completed',
                end_date=CURRENT_DATE
            WHERE id=$1;
            `,
            [id]
        );

        await syncVehicleStatus(client, maintenance.vehicle_id, "Completed");

        await client.query("COMMIT");

        return {
            message: "Maintenance completed successfully",
        };

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {

        client.release();

    }
};
