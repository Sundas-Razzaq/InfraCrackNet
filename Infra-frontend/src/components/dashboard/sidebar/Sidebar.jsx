import { useEffect, useMemo } from "react";
import {
    Building2,
    FileBarChart2,
    History,
    LayoutDashboard,
    LogOut,
    UploadCloud,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import { useSidebar } from "../../../context/SidebarContext";
import SidebarItem from "./SidebarItem";
import "./sidebar.css";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logoutUser, user } = useAuth();
    const { isCollapsed, isMobileOpen, closeSidebar } = useSidebar();

    useEffect(() => {
        closeSidebar();
    }, [location.pathname, closeSidebar]);

    const menuItems = useMemo(
        () => [
            {
                label: "Dashboard",
                to: "/dashboard",
                icon: LayoutDashboard,
                end: true,
            },
            {
                label: "Upload Inspection",
                to: "/dashboard/upload-inspection",
                icon: UploadCloud,
            },
            {
                label: "Analysis Result",
                to: "/dashboard/analysis-result",
                icon: FileBarChart2,
            },
            {
                label: "Inspection History",
                to: "/dashboard/inspection-history",
                icon: History,
            },
        ],
        [],
    );

    const handleLogout = async () => {
        await logoutUser();
        navigate("/login");
    };

    return (
        <>
            <div
                className={[
                    "dashboard-sidebar__backdrop",
                    isMobileOpen ? "is-visible" : "",
                ]
                    .filter(Boolean)
                    .join(" ")}
                onClick={closeSidebar}
            />

            <aside
                className={[
                    "dashboard-sidebar",
                    isCollapsed ? "is-collapsed" : "",
                    isMobileOpen ? "is-mobile-open" : "",
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                <div className="dashboard-sidebar__brand">
                    <div className="dashboard-sidebar__brand-mark">
                        <Building2 size={20} />
                    </div>
                    <div className="dashboard-sidebar__brand-copy">
                        <strong>InfraCrackNet</strong>
                        <span>Integrity platform</span>
                    </div>
                </div>

                <nav className="dashboard-sidebar__nav" aria-label="Dashboard navigation">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.label}
                            to={item.to}
                            label={item.label}
                            icon={item.icon}
                            end={item.end}
                        />
                    ))}
                </nav>

                <div className="dashboard-sidebar__footer">
                    <div className="dashboard-sidebar__user">
                        <div className="dashboard-sidebar__avatar">
                            {(user?.name || user?.fullName || "A").slice(0, 1).toUpperCase()}
                        </div>
                        <div className="dashboard-sidebar__user-copy">
                            <strong>{user?.name || user?.fullName || "Alex Rivera"}</strong>
                            <span>{user?.role || "Chief Inspector"}</span>
                        </div>
                    </div>

                    <SidebarItem label="Logout" icon={LogOut} danger onClick={handleLogout} />
                </div>
            </aside>
        </>
    );
}

export default Sidebar;