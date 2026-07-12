import * as dashboardService from "../services/dashboard.service.js";

export const getDashboard = async (req, res) => {
    try {

        const dashboard = await dashboardService.getDashboardStats();

        res.status(200).json({ success: true, data: dashboard });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

export const getRecentTrips = async (req, res) => {
    try {

        const trips = await dashboardService.getRecentTrips();

        res.status(200).json({ success: true, data: trips });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};