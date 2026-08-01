const express = require("express");
const router = express.Router();

const {
    createInspection,
    getInspections,
    getInspectionById,
    updateInspection,
    deleteInspection,
    getDraftInspections,
} = require("../controllers/inspectionControllers");

const {
    createInspectionValidation,
    updateInspectionValidation,
} = require("../validations/inspectionValidators");

const {
    protect,
    authorizeRoles,
} = require("../middleware/authMiddleware");

/* Create a new inspection */
router.post(
    "/",
    protect,
    authorizeRoles("Inspector", "Engineer"),
    createInspectionValidation,
    createInspection
);

/* Get all inspections */
router.get(
    "/",
    protect,
    getInspections
);

// Get draft inspections
router.get(
    "/drafts",
    protect,
    getDraftInspections
);

/* Get single inspection */
router.get(
    "/:id",
    protect,
    getInspectionById
);

/* Update inspection */
router.put(
    "/:id",
    protect,
    authorizeRoles("Inspector", "Engineer"),
    updateInspectionValidation,
    updateInspection
);

/* Delete inspection */
router.delete(
    "/:id",
    protect,
    authorizeRoles("Inspector", "Engineer"),
    deleteInspection
);

module.exports = router;