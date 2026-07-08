import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { sidebarItems } from "./sidebarConfig";
import SidebarItem from "./SidebarItem";

function Sidebar({
    userRole = "Engineer",
    isOpen,
    closeSidebar,
}) {
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
                                onClick={closeSidebar}
                            />
                        ))}
                    </ul>
                </nav>

                <footer className="sidebar-footer">
                    <button
                        type="button"
                        className="sidebar-logout"
                        onClick={closeSidebar}
                    >
                        Logout
                    </button>
                </footer>

            </aside>
        </>
    );
}

export default Sidebar;