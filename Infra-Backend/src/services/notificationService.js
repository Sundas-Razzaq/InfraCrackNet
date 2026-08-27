const Notification = require("../models/notification");

// Create notification
const createNotification = async ({
    recipient,
    type,
    title,
    message,
    relatedEntity,
    relatedEntityId,
}) => {
    const notification = await Notification.create({
        recipient,
        type,
        title,
        message,
        relatedEntity,
        relatedEntityId,
    });

    return notification;
};

// Get user's notifications
const getUserNotifications = async (userId) => {
    const notifications = await Notification.find({
        recipient: userId,
    }).sort({ createdAt: -1 });

    return notifications;
};

// Get user's unread notification count
const getUnreadNotificationCount = async (userId) => {
    const count = await Notification.countDocuments({
        recipient: userId,
        isRead: false,
    });

    return count;
};

// Mark one notification as read
const markNotificationAsRead = async (
    notificationId,
    userId
) => {
    const notification = await Notification.findOneAndUpdate(
        {
            _id: notificationId,
            recipient: userId,
            isRead: false,
        },
        {
            isRead: true,
            readAt: new Date(),
        },
        {
            returnDocument: "after",
        }
    );

    return notification;
};

// Mark all user's notifications as read
const markAllNotificationsAsRead = async (userId) => {
    const result = await Notification.updateMany(
        {
            recipient: userId,
            isRead: false,
        },
        {
            isRead: true,
            readAt: new Date(),
        }
    );

    return result;
};

module.exports = {
    createNotification,
    getUserNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
};