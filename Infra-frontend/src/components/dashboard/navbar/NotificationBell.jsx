import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../../../context/useAuth";
import { useNotifications } from "../../../context/useNotifications";
import { notificationsPath } from "../../../utils/adminpath";

function NotificationBell() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { unreadCount } = useNotifications();

    const handleNotificationClick = () => {
        navigate(notificationsPath(user?.role));
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