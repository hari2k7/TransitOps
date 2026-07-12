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

    const totalDrivers = await pool.query(
        "SELECT COUNT(*) FROM drivers"
    );

    const availableDrivers = await pool.query(
        "SELECT COUNT(*) FROM drivers WHERE status = 'Available'"
    );

    const activeTrips = await pool.query(
        "SELECT COUNT(*) FROM trips WHERE status = 'Dispatched'"
    );

    const maintenanceActive = await pool.query(
        "SELECT COUNT(*) FROM maintenance_logs WHERE status = 'Active'"
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

        totalDrivers: Number(totalDrivers.rows[0].count),
        availableDrivers: Number(availableDrivers.rows[0].count),

        activeTrips: Number(activeTrips.rows[0].count),
        maintenanceActive: Number(maintenanceActive.rows[0].count),

        fuelCost: Number(fuelCost.rows[0].coalesce),
        expenseCost: Number(expenseCost.rows[0].coalesce)
    };
};