import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

import { useNotifications } from "../../../context/useNotifications";

function NotificationBell() {
    const navigate = useNavigate();
    const { unreadCount } = useNotifications();

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