<<<<<<< HEAD
import express from 'express'

const app = express()

app.use(express.json())

export default app
=======
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import driverRoutes from "./routes/driver.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/drivers", driverRoutes);

export default app;
>>>>>>> 54c0b1122de6ffd21217c48400e45041f8d51be7
