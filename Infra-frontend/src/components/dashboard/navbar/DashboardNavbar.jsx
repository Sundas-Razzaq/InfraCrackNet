import { Bell, Menu, PanelLeftClose, Search } from "lucide-react";
import { useAuth } from "../../../context/useAuth";
import { useSidebar } from "../../../context/SidebarContext";
import "./dashboardNavbar.css";

function DashboardNavbar() {
    const { user } = useAuth();
    const { toggleSidebar, isCollapsed, isMobileOpen, isMobileView, openSidebar, closeSidebar } = useSidebar();

    const userName = user?.name || user?.fullName || "Alex Rivera";
    const userRole = user?.role || "Chief Inspector";
    const handleSidebarToggle = () => {
        if (isMobileView) {
            if (isMobileOpen) {
                closeSidebar();
            } else {
                openSidebar();
            }

            return;
        }

        toggleSidebar();
    };

    return (
        <header className="dashboard-navbar">
            <div className="dashboard-navbar__left">
                <button
                    type="button"
                    className="dashboard-navbar__toggle"
                    onClick={handleSidebarToggle}
                    aria-label="Toggle sidebar"
                    aria-expanded={isMobileView ? isMobileOpen : !isCollapsed}
                >
                    {isMobileView ? (isMobileOpen ? <PanelLeftClose size={18} /> : <Menu size={18} />) : isCollapsed ? <Menu size={18} /> : <PanelLeftClose size={18} />}
                </button>

                <div className="dashboard-navbar__brand">
                    <span className="dashboard-navbar__eyebrow">Structural AI</span>
                    <strong>InfraCrackNet</strong>
                </div>
            </div>

            <label className="dashboard-navbar__search" aria-label="Search inspections">
                <Search size={16} />
                <input type="search" placeholder="Search structures, reports or scans..." />
            </label>

            <div className="dashboard-navbar__right">
                <button type="button" className="dashboard-navbar__icon-button" aria-label="Notifications">
                    <Bell size={17} />
                </button>



                <div className="dashboard-navbar__profile">
                    <div className="dashboard-navbar__avatar">
                        {(userName || "A").slice(0, 1).toUpperCase()}
                    </div>
                    <div className="dashboard-navbar__profile-copy">
                        <strong>{userName}</strong>
                        <span>{userRole}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default DashboardNavbar;