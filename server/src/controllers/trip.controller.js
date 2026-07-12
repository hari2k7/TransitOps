import * as tripService from "../services/trip.service.js";

export const getAllTrips = async (req, res) => {
    try {
        const trips = await tripService.getAllTrips();
        res.status(200).json({ success: true, data: trips });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getTripById = async (req, res) => {
    try {
        const trip = await tripService.getTripById(req.params.id);
        res.status(200).json({ success: true, data: trip });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
};

export const createTrip = async (req, res) => {
    try {
        const trip = await tripService.createTrip(req.body);
        res.status(201).json({
            success: true,
            message: "Trip created successfully",
            data: trip,
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const dispatchTrip = async (req, res) => {
    try {
        const result = await tripService.dispatchTrip(req.params.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const completeTrip = async (req, res) => {
    try {
        const result = await tripService.completeTrip(req.params.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const updateTrip = async (req, res) => {
    try {
        const trip = await tripService.updateTrip(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Trip updated successfully",
            data: trip,
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const cancelTrip = async (req, res) => {
    try {
        const result = await tripService.cancelTrip(req.params.id);
        res.status(200).json({
            success: true,
            message: "Trip cancelled successfully",
            data: result,
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const deleteTrip = async (req, res) => {
    try {
        await tripService.deleteTrip(req.params.id);
        res.status(200).json({
            success: true,
            message: "Trip deleted successfully",
        });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
};
