import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useLocation } from "react-router-dom";

function SidebarItem({ item, onClick }) {
    const location = useLocation();

    const isActive = item.activeMatch
        ? item.activeMatch(location.pathname)
        : false;

    return (
        <li className="sidebar-nav-item">
            <NavLink
                to={item.path}
                end
                onClick={onClick}
                className={`sidebar-link ${isActive ? "active" : ""
                    }`}
            >
                <FontAwesomeIcon icon={item.icon} />

                <span className="sidebar-label">
                    {item.title}
                </span>
            </NavLink>
        </li>
    );
}

export default SidebarItem;