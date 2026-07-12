import pool from "../config/db.js";


export const getAllTrips = async () => {
    // An empty trips table is a valid state (e.g. a fresh DB), not an
    // error — don't 500 the whole page for it.
    const result = await pool.query("SELECT * FROM trips ORDER BY id");

    return result.rows;
}

export const getTripById = async (id) => {
    const result = await pool.query("SELECT * FROM trips WHERE id = $1", [id]);
    if (result.rows.length === 0) {
        throw new Error("trip not found");
    }
    return result.rows[0];
}

export const createTrip = async (tripData) => {
    const {
        vehicle_id,
        driver_id,
        source,
        destination,
        cargo_weight,
        planned_distance,
        revenue,
        priority,
        expected_delivery,
        notes
    } = tripData;

    // Check Vehicle
    const vehicleResult = await pool.query(
        "SELECT * FROM vehicles WHERE id = $1",
        [vehicle_id]
    );

    if (vehicleResult.rows.length === 0) {
        throw new Error("Vehicle not found");
    }

    const vehicle = vehicleResult.rows[0];

    // Check Vehicle Availability
    if (vehicle.status !== "Available") {
        throw new Error("Vehicle is not available");
    }

    // Check Driver
    const driverResult = await pool.query(
        "SELECT * FROM drivers WHERE id = $1",
        [driver_id]
    );

    if (driverResult.rows.length === 0) {
        throw new Error("Driver not found");
    }

    const driver = driverResult.rows[0];

    // Check Driver Availability
    if (driver.status !== "Available") {
        throw new Error("Driver is not available");
    }

    // Check Cargo Capacity
    if (cargo_weight > vehicle.max_capacity) {
        throw new Error("Cargo exceeds vehicle capacity");
    }

    // Create Trip
    const result = await pool.query(
        `INSERT INTO trips
        (vehicle_id, driver_id, source, destination, cargo_weight, planned_distance, revenue, priority, expected_delivery, notes)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *`,
        [
            vehicle_id,
            driver_id,
            source,
            destination,
            cargo_weight,
            planned_distance,
            revenue ?? null,
            priority || "Medium",
            expected_delivery || null,
            notes || null
        ]
    );

    return result.rows[0];
};

export const dispatchTrip = async (id) => {
    const tripResult = await pool.query(
        "SELECT * FROM trips WHERE id = $1",
        [id]
    );

    if (tripResult.rows.length === 0) {
        throw new Error("Trip not found");
    }

    const trip = tripResult.rows[0];

    const vehicleResult = await pool.query(
        "SELECT * FROM vehicles WHERE id = $1",
        [trip.vehicle_id]
    );

    const driverResult = await pool.query(
        "SELECT * FROM drivers WHERE id = $1",
        [trip.driver_id]
    );

    const vehicle = vehicleResult.rows[0];
    const driver = driverResult.rows[0];

    if (vehicle.status !== "Available") {
        throw new Error("Vehicle is not available");
    }

    if (driver.status !== "Available") {
        throw new Error("Driver is not available");
    }

    if (new Date(driver.license_expiry) < new Date()) {
        throw new Error("Driver license has expired");
    }

    await pool.query(
        "UPDATE trips SET status='Dispatched', start_time=CURRENT_TIMESTAMP WHERE id=$1",
        [id]
    );

    await pool.query(
        "UPDATE vehicles SET status='On Trip' WHERE id=$1",
        [trip.vehicle_id]
    );

    await pool.query(
        "UPDATE drivers SET status='On Trip' WHERE id=$1",
        [trip.driver_id]
    );

    return { message: "Trip dispatched successfully" };
};

export const completeTrip = async (id) => {
    const tripResult = await pool.query(
        "SELECT * FROM trips WHERE id = $1",
        [id]
    );

    if (tripResult.rows.length === 0) {
        throw new Error("Trip not found");
    }

    const trip = tripResult.rows[0];

    if (trip.status !== "Dispatched") {
        throw new Error("Only dispatched trips can be completed");
    }

    await pool.query(
        "UPDATE trips SET status='Completed', end_time=CURRENT_TIMESTAMP WHERE id=$1",
        [id]
    );

    await pool.query(
        "UPDATE vehicles SET status='Available' WHERE id=$1",
        [trip.vehicle_id]
    );

    await pool.query(
        "UPDATE drivers SET status='Available' WHERE id=$1",
        [trip.driver_id]
    );

    return { message: "Trip completed successfully" };
};

export const updateTrip = async (id, tripData) => {
    const tripResult = await pool.query(
        "SELECT * FROM trips WHERE id = $1",
        [id]
    );

    if (tripResult.rows.length === 0) {
        throw new Error("Trip not found");
    }

    const trip = tripResult.rows[0];

    if (trip.status !== "Draft") {
        throw new Error("Only draft trips can be updated");
    }

    const {
        vehicle_id,
        driver_id,
        source,
        destination,
        cargo_weight,
        planned_distance,
        revenue,
        priority,
        expected_delivery,
        notes
    } = tripData;

    const vehicleResult = await pool.query(
        "SELECT * FROM vehicles WHERE id = $1",
        [vehicle_id]
    );

    if (vehicleResult.rows.length === 0) {
        throw new Error("Vehicle not found");
    }

    if (cargo_weight > vehicleResult.rows[0].max_capacity) {
        throw new Error("Cargo exceeds vehicle capacity");
    }

    const driverResult = await pool.query(
        "SELECT * FROM drivers WHERE id = $1",
        [driver_id]
    );

    if (driverResult.rows.length === 0) {
        throw new Error("Driver not found");
    }

    const result = await pool.query(
        `UPDATE trips
        SET vehicle_id=$1,
            driver_id=$2,
            source=$3,
            destination=$4,
            cargo_weight=$5,
            planned_distance=$6,
            revenue=$7,
            priority=$8,
            expected_delivery=$9,
            notes=$10
        WHERE id=$11
        RETURNING *`,
        [
            vehicle_id,
            driver_id,
            source,
            destination,
            cargo_weight,
            planned_distance,
            revenue ?? null,
            priority || "Medium",
            expected_delivery || null,
            notes || null,
            id
        ]
    );

    return result.rows[0];
};

export const cancelTrip = async (id) => {

    const tripResult = await pool.query(
        "SELECT * FROM trips WHERE id = $1",
        [id]
    );

    if (tripResult.rows.length === 0) {
        throw new Error("Trip not found");
    }

    const trip = tripResult.rows[0];

    if (trip.status === "Completed") {
        throw new Error("Completed trip cannot be cancelled");
    }

    const result = await pool.query(
        "UPDATE trips SET status='Cancelled' WHERE id=$1 RETURNING *",
        [id]
    );

    return result.rows[0];
};

// New — the frontend Trips page has a permanent delete action that had no
// backend counterpart (no DELETE route existed at all before).
export const deleteTrip = async (id) => {

    const result = await pool.query(
        "DELETE FROM trips WHERE id=$1 RETURNING *",
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Trip not found");
    }

    return result.rows[0];
};