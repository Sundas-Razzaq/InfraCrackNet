import { ArrowRight, FileBarChart2, History, ShieldAlert, TriangleAlert, UploadCloud } from "lucide-react";
import { Link } from "react-router-dom";
import StatsCard from "../../components/dashboard/cards/StatsCard";
import PageHeader from "../../components/dashboard/shared/PageHeader";
import { useAuth } from "../../context/useAuth";

const stats = [
    {
        title: "Total Inspections",
        value: "24,892",
        change: "+12%",
        tone: "blue",
        icon: FileBarChart2,
        description: "Across all structures in the monitored network.",
    },
    {
        title: "Severe Cracks",
        value: "1,402",
        change: "+4.3%",
        tone: "rose",
        icon: ShieldAlert,
        description: "Requires immediate engineering review.",
    },
    {
        title: "Moderate Cracks",
        value: "3,184",
        change: "+1.9%",
        tone: "amber",
        icon: TriangleAlert,
        description: "Monitor and prioritize preventive action.",
    },
    {
        title: "Minor Cracks",
        value: "18,306",
        change: "+8.6%",
        tone: "cyan",
        icon: History,
        description: "Track condition changes across recent scans.",
    },
];

const recentInspections = [
    {
        location: "Golden Gate Bridge South Pillar",
        section: "Section A-12 | Pillar 4",
        date: "Oct 24, 2023 | 14:20",
        severity: "Severe Case",
        tone: "danger",
    },
    {
        location: "Hoover Dam Intake Tower 2",
        section: "Maintenance Deck | Level 4",
        date: "Oct 23, 2023 | 09:15",
        severity: "Moderate",
        tone: "warning",
    },
    {
        location: "Brooklyn Bridge Support Beam",
        section: "Suspension Anchor | North",
        date: "Oct 22, 2023 | 11:45",
        severity: "Clear / Secure",
        tone: "success",
    },
    {
        location: "I-95 Highway Overpass",
        section: "Exit 42 | Support Wall",
        date: "Oct 21, 2023 | 16:30",
        severity: "Moderate",
        tone: "warning",
    },
];

const quickActions = [
    {
        label: "Upload inspection",
        description: "Start a new scan and review fresh capture data.",
        to: "/dashboard/upload-inspection",
        icon: UploadCloud,
    },
    {
        label: "Review results",
        description: "Open the latest structural analysis report.",
        to: "/dashboard/analysis-result",
        icon: FileBarChart2,
    },
    {
        label: "Open history",
        description: "Inspect trends from previous maintenance rounds.",
        to: "/dashboard/inspection-history",
        icon: History,
    },
];

function Dashboard() {
    const { user } = useAuth();
    const displayName = user?.name || user?.fullName || user?.username || "Chief Inspector";

    return (
        <div className="dashboard-page">
            <PageHeader
                eyebrow="Overview"
                title={`Welcome back, ${displayName}`}
                description="Your AI models have processed recent structural captures and highlighted the highest-priority cases for review."
            >
                <div className="dashboard-page__hero-actions">
                    <Link className="dashboard-button dashboard-button--ghost" to="/dashboard/inspection-history">
                        View history
                    </Link>
                    <Link className="dashboard-button dashboard-button--primary" to="/dashboard/upload-inspection">
                        <UploadCloud size={16} />
                        Upload new image
                    </Link>
                </div>
            </PageHeader>

            <section className="dashboard-page__stats-grid">
                {stats.map((item) => (
                    <StatsCard key={item.title} {...item} />
                ))}
            </section>

            <section className="dashboard-page__quick-actions">
                {quickActions.map((action) => (
                    <Link key={action.label} to={action.to} className="dashboard-quick-action">
                        <span className="dashboard-quick-action__icon">
                            <action.icon size={18} />
                        </span>

                        <div className="dashboard-quick-action__copy">
                            <strong>{action.label}</strong>
                            <p>{action.description}</p>
                        </div>

                        <ArrowRight size={18} />
                    </Link>
                ))}
            </section>

            <section className="dashboard-panel">
                <div className="dashboard-panel__header">
                    <div>
                        <span className="dashboard-panel__eyebrow">Recent activity</span>
                        <h2>Latest inspections</h2>
                    </div>

                    <Link className="dashboard-link" to="/dashboard/inspection-history">
                        Download CSV
                    </Link>
                </div>

                <div className="dashboard-table-wrap">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Structure</th>
                                <th>Date</th>
                                <th>Severity</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentInspections.map((inspection) => (
                                <tr key={`${inspection.location}-${inspection.date}`}>
                                    <td>
                                        <div className="dashboard-table__primary">
                                            <strong>{inspection.location}</strong>
                                            <span>{inspection.section}</span>
                                        </div>
                                    </td>
                                    <td>{inspection.date}</td>
                                    <td>
                                        <span className={["dashboard-pill", `is-${inspection.tone}`].join(" ")}>
                                            {inspection.severity}
                                        </span>
                                    </td>
                                    <td>
                                        <button type="button" className="dashboard-icon-button" aria-label="View inspection">
                                            <ArrowRight size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default Dashboard;