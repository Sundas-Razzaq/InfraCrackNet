const express = require("express");
const router = express.Router();

const {
    protect,
    authorizeRoles,
} = require("../middleware/authMiddleware");

const { getAdminProfile } = require("../controllers/adminController");

// Every route added below this line is Admin-only automatically.
router.use(protect, authorizeRoles("Admin"));

router.get("/me", getAdminProfile);

module.exports = router;