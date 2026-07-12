import * as maintenanceService from "../services/maintenance.service.js";

export const getAllMaintenance = async (req, res) => {
    try {
        const maintenance = await maintenanceService.getAllMaintenance();
        res.status(200).json(maintenance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getMaintenanceById = async (req, res) => {
    try {
        const maintenance = await maintenanceService.getMaintenanceById(req.params.id);
        res.status(200).json(maintenance);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const createMaintenance = async (req, res) => {
    try {
        const maintenance = await maintenanceService.createMaintenance(req.body);
        res.status(201).json(maintenance);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateMaintenance = async (req, res) => {
    try {
        const maintenance = await maintenanceService.updateMaintenance(req.params.id, req.body);
        res.status(200).json(maintenance);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const completeMaintenance = async (req, res) => {
    try {
        const result = await maintenanceService.completeMaintenance(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};