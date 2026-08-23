const express = require("express");
const router = express.Router();

const {
    protect,
    authorizeRoles,
} = require("../middleware/authMiddleware");

const {
    generateReport,
    getReport,
    downloadReport,
    getAllReports,
    getReportCount
} = require("../controllers/reportControllers");

const {
    analysisIdValidation,
    reportIdValidation,
} = require("../validations/reportValidators");

// Generate Report

router.post(
    "/:analysisId/generate",
    protect,
    authorizeRoles("Engineer, Inspector"),
    analysisIdValidation,
    generateReport
);

// Get Single Report

router.get(
    "/:reportId",
    protect,
    reportIdValidation,
    getReport
);

// Get report count
router.get(
    "/stats/count",
    protect,
    getReportCount
);

// Download Report

router.get(
    "/:reportId/download",
    protect,
    reportIdValidation,
    downloadReport
);

// Get All Reports

router.get(
    "/",
    protect,
    getAllReports
);

module.exports = router;