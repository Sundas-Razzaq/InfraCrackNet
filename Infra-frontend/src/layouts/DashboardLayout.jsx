import { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import DashboardNavbar from "../navbar/DashboardNavbar";

function DashboardLayout({ children, user }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed((prev) => !prev);
    };

    return (
        <div className="dashboard">
            <Sidebar
                isCollapsed={isCollapsed}
                userRole={user?.role}
            />

            <main className="dashboard-main">
                <DashboardNavbar
                    onToggleSidebar={toggleSidebar}
                    user={user}
                />

                <section className="dashboard-content">
                    {children}
                </section>
            </main>
        </div>
    );
}

export default DashboardLayout;