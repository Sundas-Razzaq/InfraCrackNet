const express = require("express");
const router = express.Router();

const { listUsers } = require("../controllers/userController");

const {
    protect,
    authorizeRoles,
} = require("../middleware/authMiddleware");

/* List users - Admin only */
router.get(
    "/",
    protect,
    authorizeRoles("Admin"),
    listUsers
);

module.exports = router;