const express = require("express");
const router = express.Router();
const Inspection = require("../models/inspection");

const {
    protect,
    authorizeRoles,
} = require("../middleware/authMiddleware");

const {
    getAnnotationWorkspace,
    updateCrack,
    removeCrack,
    addManualCrack,
    validateCrack,
    completeAnnotationReview,
} = require("../controllers/annotationController");

const {
    analysisIdValidation,
    crackIdValidation,
    updateCrackValidation,
    addManualCrackValidation,
} = require("../validations/annotationValidators");

// GET ANNOTATION WORKSPACE 
router.get(
    "/:analysisId",
    protect,
    authorizeRoles("Engineer", "Inspector"),
    analysisIdValidation,
    getAnnotationWorkspace
);

// UPDATE AI CRACK 
router.patch(
    "/cracks/:crackId",
    protect,
    authorizeRoles("Engineer", "Inspector"),
    crackIdValidation,
    updateCrackValidation,
    updateCrack
);

// REMOVE AI CRACK 
router.patch(
    "/cracks/:crackId/remove",
    protect,
    authorizeRoles("Engineer", "Inspector"),
    crackIdValidation,
    removeCrack
);

// ADD MANUAL CRACK 
router.post(
    "/cracks",
    protect,
    authorizeRoles("Engineer", "Inspector"),
    addManualCrackValidation,
    addManualCrack
);

// VALIDATE AI CRACK
router.patch(
    "/cracks/:crackId/validate",
    protect,
    authorizeRoles("Engineer", "Inspector"),
    crackIdValidation,
    validateCrack
);

// COMPLETE ANNOTATION REVIEW 
router.patch(
    "/:analysisId/complete",
    protect,
    authorizeRoles("Engineer", "Inspector"),
    analysisIdValidation,
    completeAnnotationReview
);

module.exports = router;