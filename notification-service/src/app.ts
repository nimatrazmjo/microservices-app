import express from "express";
import cors from "cors";
import notificationRoutes from "./routes/notificationRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/notifications", notificationRoutes);

export default app;
