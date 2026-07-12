import * as dashboardService from "../services/dashboard.service.js";

export const getDashboard = async (req, res) => {
    try {

        const dashboard = await dashboardService.getDashboardStats();

        res.status(200).json(dashboard);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};