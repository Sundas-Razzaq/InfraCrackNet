require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

// Connect Database
connectDB();

module.exports = app;