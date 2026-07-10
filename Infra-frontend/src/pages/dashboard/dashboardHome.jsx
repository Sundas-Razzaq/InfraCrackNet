import { useAuth } from "../../context/useAuth";

import EngineerDashboard from "./engineerDashboard";
import InspectorDashboard from "./inspectorDashboard";

function DashboardHome() {
    const { user } = useAuth();

    switch (user?.role) {
        case "Engineer":
            return <EngineerDashboard />;

        case "Inspector":
            return <InspectorDashboard />;

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