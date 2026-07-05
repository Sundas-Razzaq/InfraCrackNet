import DashboardLayout from "../../layouts/DashboardLayout";

const user = {
    name: "Sundas Razzaq",
    role: "Inspector",
};

function EngineerDashboard() {
    return (
        <DashboardLayout user={user}>
            <div className="engineer-dashboard" />
        </DashboardLayout>
    );
}

export default EngineerDashboard;
