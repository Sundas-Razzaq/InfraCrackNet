import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";

function SidebarItem({ item, onClick }) {
    return (
        <li className="sidebar-item">
            <NavLink
                to={item.path}
                end={item.path === "/dashboard"}
                onClick={onClick}
                className={({ isActive }) =>
                    [
                        "sidebar-link",
                        isActive ? "active" : "",
                    ]
                        .filter(Boolean)
                        .join(" ")
                }
            >
                <span
                    className="sidebar-icon"
                    aria-hidden="true"
                >
                    <FontAwesomeIcon icon={item.icon} />
                </span>

                <span className="sidebar-label">
                    {item.title}
                </span>
            </NavLink>
        </li>
    );
}

export default SidebarItem;