const express = require("express");

const router = express.Router();

const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
} = require("../controllers/notificationControllers");

const {
    protect,
} = require("../middleware/authMiddleware");

// Get all notifications
router.get(
    "/",
    protect,
    getNotifications
);

// Get unread notification count
router.get(
    "/unread-count",
    protect,
    getUnreadCount
);

// Mark all notifications as read
router.patch(
    "/read-all",
    protect,
    markAllAsRead
);

// Mark one notification as read
router.patch(
    "/:id/read",
    protect,
    markAsRead
);

module.exports = router;