import pool from "../config/db.js";

function safetyBand(score) {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Attention";
}

// This is the only endpoint the Reports page reads from (client/src/pages/
// Reports.jsx via analyticsService.getAnalytics()). It's queried directly
// here rather than by the frontend calling /vehicles, /drivers, /trips,
// /maintenance individually, because the only two roles with analytics
// access (Fleet Manager, Financial Analyst) don't both have access to all
// of those modules under the RBAC matrix — Fleet Manager has no trips
// access, Financial Analyst has no drivers access. Aggregating server-side
// under the 'analytics' permission avoids that mismatch entirely.
export const getAnalytics = async () => {

    const fleetUtilization = await pool.query(`
        SELECT
        COALESCE((COUNT(*) FILTER (WHERE status = 'On Trip') * 100.0) / NULLIF(COUNT(*), 0),0) AS utilization,
        COALESCE((COUNT(*) FILTER (WHERE status = 'Available') * 100.0) / NULLIF(COUNT(*), 0),0) AS availability,
        COUNT(*) AS total_vehicles,
        COALESCE(SUM(acquisition_cost), 0) AS total_fleet_value
        FROM vehicles
    `);

    const vehicleTypeBreakdown = await pool.query(`
        SELECT vehicle_type AS type, COUNT(*) AS count
        FROM vehicles
        GROUP BY vehicle_type
        ORDER BY vehicle_type
    `);

    const averageSafetyScore = await pool.query(`
        SELECT COALESCE(AVG(safety_score), 0) AS average
        FROM drivers
    `);

    const driverSafety = await pool.query(`
        SELECT name, safety_score AS score
        FROM drivers
        ORDER BY safety_score DESC
    `);

    const maintenanceCost = await pool.query(`
        SELECT COALESCE(SUM(cost), 0) AS total
        FROM maintenance_logs
    `);

    const maintenanceCostByType = await pool.query(`
        SELECT type, COALESCE(SUM(cost), 0) AS cost
        FROM maintenance_logs
        GROUP BY type
        ORDER BY type
    `);

    const openWorkOrders = await pool.query(`
        SELECT COUNT(*) AS count
        FROM maintenance_logs
        WHERE status IN ('Scheduled', 'In Progress')
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
        // Original aggregate fields — kept for anything else already
        // relying on this endpoint's shape.
        fleetUtilization: Number(fleetUtilization.rows[0].utilization).toFixed(2) + "%",
        averageSafetyScore: Number(averageSafetyScore.rows[0].average).toFixed(2),
        maintenanceCost: maintenance,
        fuelCost: fuel,
        tripRevenue: revenue,
        netProfit: revenue - (maintenance + fuel + expense),

        // Fields the Reports page actually renders.
        totalVehicles: Number(fleetUtilization.rows[0].total_vehicles),
        totalFleetValue: Number(fleetUtilization.rows[0].total_fleet_value),
        utilizationPct: Math.round(Number(fleetUtilization.rows[0].utilization)),
        availabilityPct: Math.round(Number(fleetUtilization.rows[0].availability)),
        vehicleTypeBreakdown: vehicleTypeBreakdown.rows.map((r) => ({
            type: r.type,
            count: Number(r.count),
        })),
        avgSafetyScore: Math.round(Number(averageSafetyScore.rows[0].average)),
        driverSafety: driverSafety.rows.map((r) => ({
            name: r.name,
            score: r.score,
            band: safetyBand(r.score),
        })),
        totalMaintenanceSpend: maintenance,
        maintenanceCostByType: maintenanceCostByType.rows.map((r) => ({
            type: r.type,
            cost: Number(r.cost),
        })),
        openWorkOrders: Number(openWorkOrders.rows[0].count),
    };
};