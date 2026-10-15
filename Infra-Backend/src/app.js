const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const profileRoutes = require("./routes/profileRoutes");
const projectRoutes = require("./routes/projectRoutes");
const inspectionRoutes = require("./routes/inspectionRoutes");
const inspectionImageRoutes = require("./routes/inspectionImageRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const annotationRoutes = require("./routes/annotationRoutes");
const reportRoutes = require("./routes/reportRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const userRoutes = require("./routes/userRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();

const normalizeOrigin = (value) =>
    String(value || "")
        .trim()
        .replace(/\/+$/, "");

const allowedOrigins = [
    "http://localhost:5173",
    "https://infra-crack-net-6msy.vercel.app",
    process.env.FRONTEND_URL,
    ...String(process.env.ALLOWED_ORIGINS || ""), split(","),
].map(normalizeOrigin)
    .filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests like Postman or server-to-server requests
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(normalizeOrigin(origin))) {
            return callback(null, true);
        }
        console.warn(`CORS blocked origin: ${origin}`);
        return callback(new Error("Not allowed by CORS"), null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/inspections", inspectionRoutes);
app.use("/api/inspection-images", inspectionImageRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/annotations", annotationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/search", searchRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("Backend is running successfully ...............");
});

// API Test Route
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "API is working properly",
    });
});

// Error Handler
app.use(errorHandler);

module.exports = app;