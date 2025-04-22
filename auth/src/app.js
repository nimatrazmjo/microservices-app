const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

module.exports = app;
