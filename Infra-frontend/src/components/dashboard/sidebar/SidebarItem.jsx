import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useLocation } from "react-router-dom";

import { useNotifications } from "../../../context/useNotifications";

function SidebarItem({ item, onClick }) {
    const location = useLocation();
    const { unreadCount } = useNotifications();

    const isActive = item.activeMatch
        ? item.activeMatch(location.pathname)
        : false;

    const showBadge =
        item.id === "notifications" && unreadCount > 0;

    return (
        <li className="sidebar-nav-item">
            <NavLink
                to={item.path}
                end
                onClick={onClick}
                className={`sidebar-link ${isActive ? "active" : ""}`}
            >
                <FontAwesomeIcon icon={item.icon} />

                <span className="sidebar-label">
                    {item.title}
                </span>

                {showBadge && (
                    <span className="sidebar-badge">
                        {unreadCount}
                    </span>
                )}
            </NavLink>
        </li>
    );
}

export default SidebarItem;