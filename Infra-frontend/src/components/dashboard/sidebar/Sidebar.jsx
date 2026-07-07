import { sidebarItems } from "./sidebarConfig";
import SidebarItem from "./SidebarItem";

function Sidebar({ userRole = "Engineer" }) {
    return (
        <aside className="sidebar">
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
                <ul className="sidebar-nav-list">
                    {sidebarItems.map((item) => (
                        <SidebarItem
                            key={item.id}
                            item={item}
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