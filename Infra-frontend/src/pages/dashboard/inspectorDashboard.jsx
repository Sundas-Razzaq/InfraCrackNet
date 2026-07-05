import DashboardLayout from "../../layouts/DashboardLayout";

const user = {
    name: "Sundas Razzaq",
    role: "Inspector",
};

function InspectorDashboard() {
    return (
        <DashboardLayout user={user}>
            <div className="inspector-dashboard" />
        </DashboardLayout>
    );
}

export default InspectorDashboard;
