import {
    getAllDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver,
} from "../services/driver.service.js";

// GET /api/drivers
export const getDrivers = async (req, res) => {
    try {
        const drivers = await getAllDrivers();

        return res.status(200).json({
            success: true,
            data: drivers,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET /api/drivers/:id
export const getDriver = async (req, res) => {
    try {
        const driver = await getDriverById(req.params.id);

        return res.status(200).json({
            success: true,
            data: driver,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

// POST /api/drivers
export const createDriverController = async (req, res) => {
    try {
        const driver = await createDriver(req.body);

        return res.status(201).json({
            success: true,
            message: "Driver created successfully",
            data: driver,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// PUT /api/drivers/:id
export const updateDriverController = async (req, res) => {
    try {
        const driver = await updateDriver(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Driver updated successfully",
            data: driver,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// DELETE /api/drivers/:id
export const deleteDriverController = async (req, res) => {
    try {
        const driver = await deleteDriver(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Driver deleted successfully",
            data: driver,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};