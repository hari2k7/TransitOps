import pool from "../config/db.js";

export const getAnalytics = async () => {

    const fleetUtilization = await pool.query(`
        SELECT
        COALESCE((COUNT(*) FILTER (WHERE status = 'On Trip') * 100.0) / NULLIF(COUNT(*), 0),0) AS utilization
        FROM vehicles
    `);

    const averageSafetyScore = await pool.query(`
        SELECT COALESCE(AVG(safety_score), 0) AS average
        FROM drivers
    `);

    const maintenanceCost = await pool.query(`
        SELECT COALESCE(SUM(cost), 0) AS total
        FROM maintenance_logs
    `);

    const fuelCost = await pool.query(`
        SELECT COALESCE(SUM(cost), 0) AS total
        FROM fuel_logs
    `);

    const tripRevenue = await pool.query(`
        SELECT COALESCE(SUM(revenue), 0) AS total
        FROM trips
        WHERE status = 'Completed'
    `);

    const expenseCost = await pool.query(`
        SELECT COALESCE(SUM(amount), 0) AS total
        FROM expenses
    `);

    const revenue = Number(tripRevenue.rows[0].total);
    const maintenance = Number(maintenanceCost.rows[0].total);
    const fuel = Number(fuelCost.rows[0].total);
    const expense = Number(expenseCost.rows[0].total);

    return {
        fleetUtilization: Number(fleetUtilization.rows[0].utilization).toFixed(2) + "%",
        averageSafetyScore: Number(averageSafetyScore.rows[0].average).toFixed(2),
        maintenanceCost: maintenance,
        fuelCost: fuel,
        tripRevenue: revenue,
        netProfit: revenue - (maintenance + fuel + expense)
    };
};