import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import maintenanceRoutes from "./routes/maintenance.route.js";
import tripRoutes from "./routes/trip.route.js";
import fuelRoutes from "./routes/fuel.route.js";
import expenseRoutes from "./routes/expense.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";

import authenticate from "./middleware/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

// Public, no DB dependency — the frontend polls this to tell "no internet"
// apart from "backend is down/unreachable" (both look identical to axios
// as a bare Network Error otherwise).
app.get("/api/health", (req, res) => {
    res.status(200).json({ success: true, message: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/fuel-logs", fuelRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/dashboard", dashboardRoutes);


app.get("/api/profile", authenticate, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

export default app;
