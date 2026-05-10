import { NavLink } from "react-router-dom";

function SidebarItem({ to, label, icon: Icon, end = false, danger = false, onClick }) {
    const content = (
        <>
            <span className="sidebar-item__icon">
                <Icon size={18} />
            </span>
            <span className="sidebar-item__label">{label}</span>
        </>
    );

    if (to) {
        return (
            <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                    ["sidebar-item", isActive ? "is-active" : "", danger ? "is-danger" : ""]
                        .filter(Boolean)
                        .join(" ")
                }
            >
                {content}
            </NavLink>
        );
    }

    return (
        <button
            type="button"
            className={["sidebar-item", danger ? "is-danger" : ""].filter(Boolean).join(" ")}
            onClick={onClick}
        >
            {content}
        </button>
    );
}

export default SidebarItem;