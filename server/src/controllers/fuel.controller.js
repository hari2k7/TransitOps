import * as fuelService from "../services/fuel.service.js";


// GET ALL FUEL LOGS
export const getAllFuel = async (req, res) => {
    try {
        const fuelLogs = await fuelService.getAllFuelLogs();

        res.status(200).json(fuelLogs);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


// GET FUEL BY ID
export const getFuel = async (req, res) => {
    try {
        const fuel = await fuelService.getFuelLogById(req.params.id);

        if (!fuel) {
            return res.status(404).json({
                message: "Fuel record not found"
            });
        }

        res.status(200).json(fuel);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


// CREATE FUEL RECORD
export const addFuel = async (req, res) => {
    try {
        const fuel = await fuelService.createFuelLog(req.body);

        res.status(201).json({
            message: "Fuel record created successfully",
            fuel
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


// UPDATE FUEL RECORD
export const editFuel = async (req, res) => {
    try {
        const fuel = await fuelService.updateFuelLog(
            req.params.id,
            req.body
        );

        if (!fuel) {
            return res.status(404).json({
                message: "Fuel record not found"
            });
        }

        res.status(200).json({
            message: "Fuel record updated successfully",
            fuel
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};