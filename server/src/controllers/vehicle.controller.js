import {
    getAllVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
} from "../services/vehicle.service.js";

// GET /api/vehicles
export const getVehicles = async (req, res) => {
    try {
        const vehicles = await getAllVehicles();

        return res.status(200).json({
            success: true,
            data: vehicles,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET /api/vehicles/:id
export const getVehicle = async (req, res) => {
    try {
        const vehicle = await getVehicleById(req.params.id);

        return res.status(200).json({
            success: true,
            data: vehicle,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

// POST /api/vehicles
export const createVehicleController = async (req, res) => {
    try {
        const vehicle = await createVehicle(req.body);

        return res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: vehicle,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// PUT /api/vehicles/:id
export const updateVehicleController = async (req, res) => {
    try {
        const vehicle = await updateVehicle(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: vehicle,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// DELETE /api/vehicles/:id
export const deleteVehicleController = async (req, res) => {
    try {
        const vehicle = await deleteVehicle(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
            data: vehicle,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};