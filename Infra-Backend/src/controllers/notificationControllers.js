const {
    getUserNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} = require("../services/notificationService");

// Get all notifications for logged-in user
const getNotifications = async (req, res, next) => {
    try {
        const notifications = await getUserNotifications(
            req.user.id
        );

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications,
        });
    } catch (error) {
        next(error);
    }
};

// Get unread notification count
const getUnreadCount = async (req, res, next) => {
    try {
        const count = await getUnreadNotificationCount(
            req.user.id
        );

        res.status(200).json({
            success: true,
            count,
        });
    } catch (error) {
        next(error);
    }
};

// Mark one notification as read
const markAsRead = async (req, res, next) => {
    try {
        const notification = await markNotificationAsRead(
            req.params.id,
            req.user.id
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Notification marked as read.",
            data: notification,
        });
    } catch (error) {
        next(error);
    }
};

// Mark all notifications as read
const markAllAsRead = async (req, res, next) => {
    try {
        const result = await markAllNotificationsAsRead(
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "All notifications marked as read.",
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
};