const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || origin === allowedOrigin) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

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