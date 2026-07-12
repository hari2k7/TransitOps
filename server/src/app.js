import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import maintenanceRoutes from "./routes/maintenance.routes.js";

import authenticate from "./middleware/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/maintenance", maintenanceRoutes);


app.get("/api/profile", authenticate, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

export default app;
