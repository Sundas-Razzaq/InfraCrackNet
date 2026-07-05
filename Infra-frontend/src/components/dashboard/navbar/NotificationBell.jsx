import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

function NotificationBell() {
    return (
        <button type="button" className="notification-button" aria-label="Notifications">
            <FontAwesomeIcon icon={faBell} />
            <span className="notification-badge" aria-label="3 unread notifications">
                3
            </span>
        </button>
    );
}

export default NotificationBell;