const express = require("express");
const router = express.Router();

const {
    protect,
    authorizeRoles,
} = require("../middleware/authMiddleware");

const { getAdminProfile } = require("../controllers/adminController");

const { getActivityLogs } = require("../controllers/activityLogController");
const {
    listActivityLogsValidation,
} = require("../validations/activityLogValidators");

// Every route added below this line is Admin-only automatically.
router.use(protect, authorizeRoles("Admin"));

router.get("/me", getAdminProfile);
router.get("/activity-log", listActivityLogsValidation, getActivityLogs);

module.exports = router;