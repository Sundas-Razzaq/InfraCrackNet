import Sidebar from "../components/dashboard/sidebar/Sidebar";
import DashboardNavbar from "../components/dashboard/navbar/DashboardNavbar";
function DashboardLayout({ children, user }) {
    return (
        <div className="dashboard">
            <Sidebar userRole={user?.role} />

            <main className="dashboard-main">
                <DashboardNavbar user={user} />

                <section className="dashboard-content">
                    {children}
                </section>
            </main>
        </div>
    );
}

export default DashboardLayout;