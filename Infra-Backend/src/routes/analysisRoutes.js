const express = require("express");
const router = express.Router();

const {
    startAnalysis,
    getAnalysisProgress,
    getAnalysisResults,
    cancelAnalysis,
} = require("../controllers/analysisController");

const {
    startAnalysisValidation,
} = require("../validations/analysisValidators");

const {
    protect,
    authorizeRoles,
} = require("../middleware/authMiddleware");

// Start AI Analysis 
router.post(
    "/run",
    protect,
    authorizeRoles("Inspector", "Engineer"),
    startAnalysisValidation,
    startAnalysis
);

// Get Analysis Progress 
router.get(
    "/:analysisId/progress",
    protect,
    getAnalysisProgress
);

// Get Analysis Results 
router.get(
    "/:analysisId/results",
    protect,
    getAnalysisResults
);

// Cancel Analysis 
router.patch(
    "/:analysisId/cancel",
    protect,
    authorizeRoles("Inspector", "Engineer"),
    cancelAnalysis
);

module.exports = router;