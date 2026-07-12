import pool from "../config/db.js";

export const getDashboardStats = async () => {

    const totalVehicles = await pool.query(
        "SELECT COUNT(*) FROM vehicles"
    );

    const availableVehicles = await pool.query(
        "SELECT COUNT(*) FROM vehicles WHERE status = 'Available'"
    );

    const vehiclesOnTrip = await pool.query(
        "SELECT COUNT(*) FROM vehicles WHERE status = 'On Trip'"
    );

    const vehiclesInShop = await pool.query(
        "SELECT COUNT(*) FROM vehicles WHERE status = 'In Shop'"
    );

    const vehiclesRetired = await pool.query(
        "SELECT COUNT(*) FROM vehicles WHERE status = 'Retired'"
    );

    const totalDrivers = await pool.query(
        "SELECT COUNT(*) FROM drivers"
    );

    const availableDrivers = await pool.query(
        "SELECT COUNT(*) FROM drivers WHERE status = 'Available'"
    );

    const activeTrips = await pool.query(
        "SELECT COUNT(*) FROM trips WHERE status = 'Dispatched'"
    );

    // "Active" maintenance now covers both stages of open work under the
    // 4-state workflow (the old schema only had a single 'Active' status).
    const maintenanceActive = await pool.query(
        "SELECT COUNT(*) FROM maintenance_logs WHERE status IN ('Scheduled', 'In Progress')"
    );

    const fuelCost = await pool.query(
        "SELECT COALESCE(SUM(cost),0) FROM fuel_logs"
    );

    const expenseCost = await pool.query(
        "SELECT COALESCE(SUM(amount),0) FROM expenses"
    );

    return {
        totalVehicles: Number(totalVehicles.rows[0].count),
        availableVehicles: Number(availableVehicles.rows[0].count),
        vehiclesOnTrip: Number(vehiclesOnTrip.rows[0].count),
        vehiclesInShop: Number(vehiclesInShop.rows[0].count),
        vehiclesRetired: Number(vehiclesRetired.rows[0].count),

        totalDrivers: Number(totalDrivers.rows[0].count),
        availableDrivers: Number(availableDrivers.rows[0].count),

        activeTrips: Number(activeTrips.rows[0].count),
        maintenanceActive: Number(maintenanceActive.rows[0].count),

        fuelCost: Number(fuelCost.rows[0].coalesce),
        expenseCost: Number(expenseCost.rows[0].coalesce)
    };
};

// Dashboard-level summary, intentionally not gated by the Trips module's
// RBAC (Fleet Manager / Financial Analyst can't open /trips but should
// still see a glance of recent activity on their landing page).
export const getRecentTrips = async () => {

    const result = await pool.query(`
        SELECT
            t.id,
            t.status,
            v.vehicle_name,
            d.name AS driver_name
        FROM trips t
        LEFT JOIN vehicles v ON t.vehicle_id = v.id
        LEFT JOIN drivers d ON t.driver_id = d.id
        ORDER BY t.created_at DESC
        LIMIT 5;
    `);

    return result.rows;
};