import { sidebarItems } from "./sidebarConfig";
import SidebarItem from "./SidebarItem";

function Sidebar({
    isCollapsed,
    userRole = "Engineer",
}) {
    return (
        <aside
            className={`sidebar ${isCollapsed ? "is-collapsed" : ""}`}
        >
            <header className="sidebar-header">
                <div className="sidebar-logo">
                    InfraCrackNet
                </div>

                <div className="sidebar-role">
                    {userRole}
                </div>
            </header>

            <nav
                className="sidebar-nav"
                aria-label="Dashboard Navigation"
            >
                <ul>
                    {sidebarItems.map((item) => (
                        <SidebarItem
                            key={item.id}
                            item={item}
                            isCollapsed={isCollapsed}
                        />
                    ))}
                </ul>
            </nav>

            <footer className="sidebar-footer">
                <button
                    type="button"
                    className="sidebar-logout"
                >
                    Logout
                </button>
            </footer>
        </aside>
    );
}

export default Sidebar;