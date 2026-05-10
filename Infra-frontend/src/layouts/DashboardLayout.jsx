import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import DashboardNavbar from "../components/dashboard/navbar/DashboardNavbar";
import { SidebarProvider } from "../context/SidebarContext";

function DashboardLayout() {
    return (
        <SidebarProvider>
            <div className="dashboard-layout">
                <Sidebar />

                <div className="dashboard-layout__viewport">
                    <DashboardNavbar />

                    <main className="dashboard-layout__content">
                        <Outlet />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}

export default DashboardLayout;