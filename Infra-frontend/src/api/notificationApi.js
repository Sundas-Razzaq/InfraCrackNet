import authApi from "./authApi";

// Get All Notifications

export const getNotifications = async () => {
    const { data } = await authApi.get(
        "/notifications"
    );

    return data;
};

// Get Unread Notification Count

export const getUnreadNotificationCount = async () => {
    const { data } = await authApi.get(
        "/notifications/unread-count"
    );

    return data;
};

// Mark Notification as Read

export const markNotificationAsRead = async (
    notificationId
) => {
    const { data } = await authApi.patch(
        `/notifications/${notificationId}/read`
    );

    return data;
};

// Mark All Notifications as Read

export const markAllNotificationsAsRead = async () => {
    const { data } = await authApi.patch(
        "/notifications/read-all"
    );

    return data;
};