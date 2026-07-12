import * as analyticsService from "../services/analytics.service.js";

export const getAnalytics = async (req, res) => {
    try {

        const analytics = await analyticsService.getAnalytics();

        res.status(200).json({ success: true, data: analytics });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};