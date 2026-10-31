const express = require("express");
const router = express.Router();

const { getMyTeam } = require("../controllers/teamController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

/* The caller's own team (read-only). No id param on purpose. */
router.get("/my", protect, authorizeRoles("Engineer", "Inspector"), getMyTeam);

module.exports = router;