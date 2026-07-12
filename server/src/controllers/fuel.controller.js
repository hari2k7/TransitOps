import * as fuelService from "../services/fuel.service.js";


// GET ALL FUEL LOGS
export const getAllFuel = async (req, res) => {
    try {
        const fuelLogs = await fuelService.getAllFuelLogs();

        res.status(200).json({ success: true, data: fuelLogs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


// GET FUEL BY ID
export const getFuel = async (req, res) => {
    try {
        const fuel = await fuelService.getFuelLogById(req.params.id);

        res.status(200).json({ success: true, data: fuel });

    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
};


// CREATE FUEL RECORD
export const addFuel = async (req, res) => {
    try {
        const fuel = await fuelService.createFuelLog(req.body);

        res.status(201).json({
            success: true,
            message: "Fuel record created successfully",
            data: fuel,
        });

    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};


// UPDATE FUEL RECORD
export const editFuel = async (req, res) => {
    try {
        const fuel = await fuelService.updateFuelLog(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Fuel record updated successfully",
            data: fuel,
        });

    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
