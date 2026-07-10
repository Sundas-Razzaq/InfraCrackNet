import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/dashboard/sidebar/Sidebar";
import DashboardNavbar from "../components/dashboard/navbar/DashboardNavbar";

import { useAuth } from "../context/useAuth";

function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { user } = useAuth();

    return (
        <div className="dashboard">
            <Sidebar
                userRole={user?.role || ""}
                isOpen={sidebarOpen}
                closeSidebar={() => setSidebarOpen(false)}
            />

            <main className="dashboard-main">
                <DashboardNavbar
                    user={user}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <section className="dashboard-content">
                    <Outlet />
                </section>
            </main>
        </div>
    );
}

export default DashboardLayout;