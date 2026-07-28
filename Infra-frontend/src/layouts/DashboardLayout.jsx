import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

import Sidebar from "../components/dashboard/sidebar/Sidebar";
import DashboardNavbar from "../components/dashboard/navbar/DashboardNavbar";

import { useAuth } from "../context/useAuth";
import { pageTransition } from "../utils/animation";

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

                <motion.section
                    className="dashboard-content"
                    variants={pageTransition}
                    initial="hidden"
                    animate="visible"
                >
                    <Outlet />
                </motion.section>
            </main>
        </div>
    );
}

export default DashboardLayout;