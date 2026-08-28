import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

import { getUnreadNotificationCount } from "../../../api/notificationApi";

function NotificationBell() {
    const navigate = useNavigate();
    const location = useLocation();

    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await getUnreadNotificationCount();

                setUnreadCount(response.count || 0);
            } catch (error) {
                console.error(
                    "Failed to fetch unread notification count:",
                    error
                );
            }
        };

        fetchUnreadCount();
    }, [location.pathname]);

    const handleNotificationClick = () => {
        navigate("/dashboard/notifications");
    };

    return (
        <button
            type="button"
            className="notification-button"
            aria-label="Notifications"
            onClick={handleNotificationClick}
        >
            <FontAwesomeIcon icon={faBell} />

            {unreadCount > 0 && (
                <span
                    className="notification-badge"
                    aria-label={`${unreadCount} unread notifications`}
                >
                    {unreadCount}
                </span>
            )}
        </button>
    );
}

export default NotificationBell;