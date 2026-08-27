import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../../api/notificationApi";
import { getReport } from "../../api/reportApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import {
    pageTransition,
    fadeInUp,
    staggerContainer,
} from "../../utils/animation";

import {
    faTriangleExclamation,
    faRobot,
    faCircleCheck,
    faClock,
    faUserPlus,
    faFileLines,
} from "@fortawesome/free-solid-svg-icons";

const notificationIcons = {
    critical: faTriangleExclamation,
    analysis: faRobot,
    success: faCircleCheck,
    warning: faClock,
    team: faUserPlus,
    report: faFileLines,
    inspection: faTriangleExclamation,
};

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                setError("");

                const [notificationsResponse, unreadResponse] =
                    await Promise.all([
                        getNotifications(),
                        getUnreadNotificationCount(),
                    ]);

                setNotifications(
                    notificationsResponse.data || []
                );

                setUnreadCount(
                    unreadResponse.count || 0
                );
            } catch (error) {
                console.error(
                    "Failed to fetch notifications:",
                    error
                );

                setError("Failed to load notifications.");
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();

            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) => ({
                    ...notification,
                    isRead: true,
                }))
            );

            setUnreadCount(0);
        } catch (error) {
            console.error(
                "Failed to mark all notifications as read:",
                error
            );
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            // Mark notification as read
            if (!notification.isRead) {
                await markNotificationAsRead(notification._id);

                setNotifications((prev) =>
                    prev.map((item) =>
                        item._id === notification._id
                            ? {
                                ...item,
                                isRead: true,
                            }
                            : item
                    )
                );

                setUnreadCount((prev) =>
                    Math.max(prev - 1, 0)
                );
            }

            // Handle report notification
            if (
                notification.type === "report" &&
                notification.relatedEntity === "Report" &&
                notification.relatedEntityId
            ) {
                const response = await getReport(
                    notification.relatedEntityId
                );

                const report = response.data.report;

                navigate(
                    `/dashboard/inspection/${report.inspection._id}/report/${report._id}`
                );
            }
        } catch (error) {
            console.error(
                "Failed to open notification:",
                error
            );
        }
    };
    return (

        <>
            <motion.div
                className="notifications-page"
                variants={pageTransition}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}

                <motion.div
                    className="notifications-header"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                >
                    <div>
                        <h1 className="notifications-title">
                            Notifications
                        </h1>

                        <p className="notifications-subtitle">
                            {unreadCount} unread notification
                            {unreadCount !== 1 ? "s" : ""}
                        </p>
                    </div>

                    <div className="notifications-actions">
                        <button className="btn-secondary" onClick={handleMarkAllAsRead}>
                            Mark all read
                        </button>

                        <button className="btn-secondary">
                            Settings
                        </button>
                    </div>

                </motion.div>

                {/* Tabs */}

                <motion.div
                    className="notification-tabs"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.1 }}
                >
                    <button className="notification-tab active">
                        All ({notifications.length})
                    </button>

                    <button className="notification-tab">
                        Unread ({unreadCount})
                    </button>

                    <button className="notification-tab">
                        Critical (1)
                    </button>

                    <button className="notification-tab">
                        Reports (2)
                    </button>

                </motion.div>

                {/* List */}
                {loading && (
                    <div className="notification-loading">
                        Loading notifications...
                    </div>
                )}

                {error && (
                    <div className="notification-error">
                        {error}
                    </div>
                )}
                {!loading && !error && (
                    <motion.div
                        className="notification-list"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        {notifications.map((notification) => (
                            <motion.div
                                key={notification._id}
                                className={`notification-item card ${notification.type}`}
                                variants={fadeInUp}
                                whileHover={{
                                    y: -3,
                                    transition: { duration: 0.2 },
                                }}
                                onClick={() =>
                                    handleNotificationClick(notification)
                                }
                                style={{ cursor: "pointer" }}
                            >
                                <div className="notification-icon">
                                    <FontAwesomeIcon icon={notificationIcons[notification.type]} />
                                </div>

                                <div className="notification-content">

                                    <div className="notification-top">

                                        <h3 className="notification-title">
                                            {notification.title}
                                        </h3>

                                        <span className="notification-time">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </span>

                                    </div>

                                    <div className="notification-bottom">

                                        <p className="notification-message">
                                            {notification.message}
                                        </p>

                                        {!notification.isRead && (
                                            <span className="notification-dot"></span>
                                        )}

                                    </div>

                                </div>

                            </motion.div>
                        ))}

                    </motion.div>
                )}
            </motion.div>
        </>
    );
};

export default Notifications;