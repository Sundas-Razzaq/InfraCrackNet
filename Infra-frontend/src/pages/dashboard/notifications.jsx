import { motion } from "framer-motion";

import { useNotifications } from "../../context/useNotifications";

import {
    pageTransition,
    fadeInUp,
    staggerContainer,
} from "../../utils/animation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

    const {
        notifications,
        unreadCount,
        loading,
        markAllAsRead,
        handleNotificationClick,
    } = useNotifications();

    return (
        <motion.div
            className="notifications-page"
            variants={pageTransition}
            initial="hidden"
            animate="visible"
        >
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
                    <button
                        className="btn-secondary"
                        onClick={markAllAsRead}
                    >
                        Mark all read
                    </button>
                </div>
            </motion.div>

            {loading && (
                <div className="notification-loading">
                    Loading notifications...
                </div>
            )}

            {!loading && (
                <motion.div
                    className="notification-list"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {notifications.length === 0 && (
                        <div className="notification-empty">
                            No notifications yet.
                        </div>
                    )}

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
                                <FontAwesomeIcon
                                    icon={
                                        notificationIcons[
                                        notification.type
                                        ] || faTriangleExclamation
                                    }
                                />
                            </div>

                            <div className="notification-content">
                                <div className="notification-top">
                                    <h3 className="notification-title">
                                        {notification.title}
                                    </h3>

                                    <span className="notification-time">
                                        {new Date(
                                            notification.createdAt
                                        ).toLocaleString()}
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
    );
};

export default Notifications;