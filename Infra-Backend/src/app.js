const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');
const authRoutes = require("./routes/authRoutes");
const inspectionRoutes = require("./routes/inspection.routes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

const corsOptions = {
    origin: true,
    credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

// Serve uploaded files (images, processed images, pdf reports)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Inspection routes (protected internally)
app.use('/api/inspections', inspectionRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("Backend is running successfully 🚀");
});

// API Test Route
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "API is working properly",
    });
});

app.use(errorHandler);

module.exports = app;