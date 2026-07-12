import {
    getAllMaintenance as getAllMaintenanceRecords,
    getMaintenanceById as getMaintenanceRecordById,
    createMaintenance as createMaintenanceRecord,
    updateMaintenance as updateMaintenanceRecord,
    completeMaintenance as completeMaintenanceRecord,
} from "../services/maintenance.service.js";

// GET /api/maintenance
export const getAllMaintenance = async (req, res) => {
    try {
        const records = await getAllMaintenanceRecords();

        return res.status(200).json({
            success: true,
            data: records,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET /api/maintenance/:id
export const getMaintenanceById = async (req, res) => {
    try {
        const record = await getMaintenanceRecordById(req.params.id);

        return res.status(200).json({
            success: true,
            data: record,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

// POST /api/maintenance
export const createMaintenance = async (req, res) => {
    try {
        const record = await createMaintenanceRecord(req.body);

        return res.status(201).json({
            success: true,
            message: "Maintenance record created successfully",
            data: record,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// PUT /api/maintenance/:id
export const updateMaintenance = async (req, res) => {
    try {
        const record = await updateMaintenanceRecord(req.params.id, req.body);

        return res.status(200).json({
            success: true,
            message: "Maintenance record updated successfully",
            data: record,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// PATCH /api/maintenance/:id/complete
export const completeMaintenance = async (req, res) => {
    try {
        const result = await completeMaintenanceRecord(req.params.id);

        return res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
