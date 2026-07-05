import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";

function SidebarItem({ item, isCollapsed }) {
    return (
        <li className="sidebar-item">
            <NavLink
                to={item.path}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                    ["sidebar-link", isActive ? "active" : ""].filter(Boolean).join(" ")
                }
            >
                <span className="sidebar-icon" aria-hidden="true">
                    <FontAwesomeIcon icon={item.icon} />
                </span>
                {!isCollapsed ? <span className="sidebar-label">{item.title}</span> : null}
            </NavLink>
        </li>
    );
}

export default SidebarItem;