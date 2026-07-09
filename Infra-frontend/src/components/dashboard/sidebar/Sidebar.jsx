import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { sidebarItems } from "./sidebarConfig";
import SidebarItem from "./SidebarItem";
import { useAuth } from "../../../context/useAuth";

function Sidebar({
    userRole = "",
    isOpen,
    closeSidebar,
}) {
    const { logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <>
            <div
                className={`sidebar-overlay ${isOpen ? "active" : ""}`}
                onClick={closeSidebar}
            />

            <aside className={`sidebar ${isOpen ? "is-open" : ""}`}>
                <header className="sidebar-header">
                    <div className="sidebar-header-top">
                        <div className="sidebar-logo">
                            InfraCrackNet
                        </div>

                        <button
                            type="button"
                            className="sidebar-close-btn"
                            onClick={closeSidebar}
                            aria-label="Close sidebar"
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>

                    <div className="sidebar-role">
                        {userRole || "Loading..."}
                    </div>
                </header>

                <nav
                    className="sidebar-nav"
                    aria-label="Dashboard Navigation"
                >
                    <ul className="sidebar-nav-list">
                        {sidebarItems.map((item) => (
                            <SidebarItem
                                key={item.id}
                                item={item}
                                onClick={closeSidebar}
                            />
                        ))}
                    </ul>
                </nav>

                <footer className="sidebar-footer">
                    <button
                        type="button"
                        className="sidebar-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </footer>
            </aside>
        </>
    );
}

export default Sidebar;