import { useAuth } from "../../context/useAuth";
import { Navigate } from "react-router-dom";
import EngineerDashboard from "./engineerDashboard";
import InspectorDashboard from "./inspectorDashboard";

function DashboardHome() {
    const { user } = useAuth();

    switch (user?.role) {
        case "Engineer":
            return <EngineerDashboard />;
        case "Inspector":
            return <InspectorDashboard />;
        case "Admin":
            return <Navigate to="/dashboard/admin/dashboard" replace />;

        default:
            return (
                <div className="dashboard-empty-state">
                    <h2>Unauthorized</h2>
                    <p>Your account does not have access to a dashboard.</p>
                </div>
            );
    }
}

export default DashboardHome;