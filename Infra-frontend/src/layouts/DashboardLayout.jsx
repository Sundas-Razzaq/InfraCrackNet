import { useState } from "react";

import Sidebar from "../components/dashboard/sidebar/Sidebar";
import DashboardNavbar from "../components/dashboard/navbar/DashboardNavbar";

function DashboardLayout({ children, user }) {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="dashboard">

            <Sidebar
                userRole={user?.role}
                isOpen={sidebarOpen}
                closeSidebar={() => setSidebarOpen(false)}
            />

            <main className="dashboard-main">

                <DashboardNavbar
                    user={user}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <section className="dashboard-content">
                    {children}
                </section>

            </main>

        </div>
    );
}

export default DashboardLayout;