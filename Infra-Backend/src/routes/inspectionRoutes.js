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

/* Create — Inspector only */
router.post(
    "/",
    protect,
    authorizeRoles("Inspector"),
    createInspectionValidation,
    createInspection
);

/* Get all — both roles (filtered inside controller) */
router.get("/", protect, getInspections);

/* Drafts — Inspector only */
router.get(
    "/drafts",
    protect,
    authorizeRoles("Inspector"),
    getDraftInspections
);

/* Get single — both roles (filtered inside controller) */
router.get("/:id", protect, getInspectionById);

/* Update —  Inspector only */
router.put(
    "/:id",
    protect,
    authorizeRoles("Inspector"),
    updateInspectionValidation,
    updateInspection
);

/* Delete — Inspector only */
router.delete(
    "/:id",
    protect,
    authorizeRoles("Inspector"),
    deleteInspection
);

module.exports = router;