import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTriangleExclamation,
    faRobot,
    faCircleCheck,
    faClock,
    faUserPlus,
    faFileLines,
} from "@fortawesome/free-solid-svg-icons";

import NotificationContext from "./notificationContext";
import { useAuth } from "./useAuth";
import {
    getNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../api/notificationApi";
import { getReport } from "../api/reportApi";
import {
    adminNotificationTarget,
    notificationsPath,
} from "../utils/adminpath";

const POLL_INTERVAL_MS = 15000;

const notificationIcons = {
    critical: faTriangleExclamation,
    analysis: faRobot,
    success: faCircleCheck,
    warning: faClock,
    team: faUserPlus,
    report: faFileLines,
    inspection: faTriangleExclamation,
};

export function NotificationProvider({ children }) {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const lastUnreadCountRef = useRef(null);
    const seenNotificationIdsRef = useRef(new Set());
    const locationPathRef = useRef(location.pathname);
    const showNotificationPopupRef = useRef(null);

    useEffect(() => {
        locationPathRef.current = location.pathname;
    }, [location.pathname]);

    /* CLICK HANDLER — declared first because popup uses it */

    const handleNotificationClick = async (notification) => {
        try {
            if (!notification.isRead) {
                await markNotificationAsRead(notification._id);

                setNotifications((prev) =>
                    prev.map((item) =>
                        item._id === notification._id
                            ? { ...item, isRead: true }
                            : item
                    )
                );

                setUnreadCount((prev) => Math.max(prev - 1, 0));
            }

            const { relatedEntity, relatedEntityId } = notification;

            if (user?.role === "Admin") {
                const target = adminNotificationTarget(relatedEntity, relatedEntityId);
                if (target) navigate(target);
                return;
            }

            if (relatedEntity === "Report" && relatedEntityId) {
                const response = await getReport(relatedEntityId);
                const report = response.data.report;

                navigate(
                    `/dashboard/inspection/${report.inspection._id}/report/${report._id}`
                );
                return;
            }

            if (relatedEntity === "Analysis" && relatedEntityId) {
                navigate(
                    `/dashboard/ai-analysis/${relatedEntityId}`
                );
                return;
            }

            if (relatedEntity === "Inspection" && relatedEntityId) {
                navigate(
                    `/dashboard/inspection/${relatedEntityId}`
                );
                return;
            }

            if (relatedEntity === "Project" && relatedEntityId) {
                navigate(
                    `/dashboard/projects/${relatedEntityId}`
                );
                return;
            }
        } catch (error) {
            console.error(
                "Failed to open notification:",
                error
            );
        }
    };

    /*POPUP */

    const showNotificationPopup = (notification) => {
        if (locationPathRef.current === notificationsPath(user?.role)) {
            return;
        }

        const icon =
            notificationIcons[notification.type] ||
            faTriangleExclamation;

        toast(
            ({ closeToast }) => (
                <div
                    className={`notification-popup ${notification.type}`}
                    onClick={() => {
                        closeToast();
                        handleNotificationClick(notification);
                    }}
                >
                    <div className="notification-popup-icon">
                        <FontAwesomeIcon icon={icon} />
                    </div>

                    <div className="notification-popup-content">
                        <h4 className="notification-popup-title">
                            {notification.title}
                        </h4>
                        <p className="notification-popup-message">
                            {notification.message}
                        </p>
                    </div>
                </div>
            ),
            {
                position: "top-right",
                autoClose: 6000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false,
                closeButton: false,
                className: "notification-popup-toast",
            }
        );
    };
    useEffect(() => {
        showNotificationPopupRef.current = showNotificationPopup;
    });

    /*MARK AS READ*/

    const markAsRead = async (notificationId) => {
        await markNotificationAsRead(notificationId);

        setNotifications((prev) =>
            prev.map((item) =>
                item._id === notificationId
                    ? { ...item, isRead: true }
                    : item
            )
        );

        setUnreadCount((prev) => Math.max(prev - 1, 0));
    };

    const markAllAsRead = async () => {
        await markAllNotificationsAsRead();

        setNotifications((prev) =>
            prev.map((item) => ({ ...item, isRead: true }))
        );

        setUnreadCount(0);
    };

    /*RESET ON LOGOUT — separated effect with microtask
       so React doesn't flag synchronous setState*/

    useEffect(() => {
        if (isAuthenticated) return;

        const id = setTimeout(() => {
            setNotifications([]);
            setUnreadCount(0);
            setLoading(false);
            lastUnreadCountRef.current = null;
            seenNotificationIdsRef.current = new Set();
        }, 0);

        return () => clearTimeout(id);
    }, [isAuthenticated]);

    /*INITIAL LOAD*/

    useEffect(() => {
        if (!isAuthenticated) return;

        let isMounted = true;

        const initialLoad = async () => {
            try {
                setLoading(true);

                const [list, count] = await Promise.all([
                    getNotifications().then((r) => r.data || []),
                    getUnreadNotificationCount().then(
                        (r) => r.count || 0
                    ),
                ]);

                if (!isMounted) return;

                setNotifications(list);
                setUnreadCount(count);
                lastUnreadCountRef.current = count;

                list.forEach((n) =>
                    seenNotificationIdsRef.current.add(n._id)
                );
            } catch (error) {
                console.error(
                    "Failed to load notifications:",
                    error
                );
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        initialLoad();

        return () => {
            isMounted = false;
        };
    }, [isAuthenticated]);

    /*POLLING */

    useEffect(() => {
        if (!isAuthenticated) return;

        const poll = async () => {
            try {
                const count = await getUnreadNotificationCount().then(
                    (r) => r.count || 0
                );

                const previousCount = lastUnreadCountRef.current;

                if (previousCount === null) {
                    lastUnreadCountRef.current = count;
                    setUnreadCount(count);
                    return;
                }

                if (count > previousCount) {
                    const response = await getNotifications();
                    const list = response.data || [];

                    setNotifications(list);
                    setUnreadCount(count);

                    const newOnes = list.filter(
                        (n) =>
                            !seenNotificationIdsRef.current.has(n._id)
                    );

                    newOnes.forEach((n) => {
                        seenNotificationIdsRef.current.add(n._id);
                        showNotificationPopupRef.current?.(n);
                    });
                } else if (count !== previousCount) {
                    setUnreadCount(count);
                }

                lastUnreadCountRef.current = count;
            } catch (error) {
                console.error("Poll error:", error.message);
            }
        };

        const intervalId = setInterval(poll, POLL_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [isAuthenticated]);

    /*CONTEXT*/

    const value = {
        notifications,
        unreadCount,
        loading,
        fetchNotifications: async () => {
            const response = await getNotifications();
            return response.data || [];
        },
        fetchUnreadCount: async () => {
            const response = await getUnreadNotificationCount();
            return response.count || 0;
        },
        markAsRead,
        markAllAsRead,
        handleNotificationClick,
        showNotificationPopup,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}