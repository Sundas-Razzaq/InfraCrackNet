const express = require("express");
const router = express.Router();
const {
    startAnalysis,
    getInspectionAnalysis,
    getAllAnalysis,
    getAnalysisProgress,
    getAnalysisResults,
    approveAnalysis,
    rejectAnalysis,
    cancelAnalysis,
} = require("../controllers/analysisController");

const {
    startAnalysisValidation,
    rejectAnalysisValidation,
} = require("../validations/analysisValidators");

const {
    protect,
    authorizeRoles,
} = require("../middleware/authMiddleware");

// Start AI Analysis 
router.post(
    "/run/:inspectionId",
    protect,
    authorizeRoles("Engineer"),
    startAnalysisValidation,
    startAnalysis
);

// Get Latest Analysis For Inspection
router.get(
    "/inspection/:inspectionId",
    protect,
    getInspectionAnalysis
);

// Get All AI Analyses
router.get(
    "/",
    protect,
    getAllAnalysis
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

// Approve AI Analysis
router.patch(
    "/:analysisId/approve",
    protect,
    authorizeRoles("Engineer"),
    approveAnalysis
);

// Reject AI Analysis
router.patch(
    "/:analysisId/reject",
    protect,
    authorizeRoles("Engineer"),
    rejectAnalysisValidation,
    rejectAnalysis
);

// Cancel Analysis 
router.patch(
    "/:analysisId/cancel",
    protect,
    authorizeRoles("Engineer"),
    cancelAnalysis
);

module.exports = router;