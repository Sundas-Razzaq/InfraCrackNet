import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileLines,
    faFolderOpen,
    faPeopleGroup,
    faUserPlus,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

import PageHeader from "../../components/dashboard/shared/PageHeader";
import StatsGrid from "../../components/dashboard/shared/StatsGrid";
import StatsCard from "../../components/dashboard/cards/StatsCard";
import DashboardGrid from "../../components/dashboard/shared/dashboardGrid";
import WidgetCard from "../../components/dashboard/shared/widgetCard";
import StatusBadge from "../../components/dashboard/cards/statusBadge";
import ProgressBar from "../../components/dashboard/cards/progressBar";
import AiSimulatedBanner from "../../components/admin/AiSimulatedBanner";

import { getAdminDashboard } from "../../api/adminApi";
import { getApiErrorMessage } from "../../api/authApi";
import { useAuth } from "../../context/useAuth";
import { fadeInUp, staggerContainer } from "../../utils/animation";

const BASE = "/dashboard/admin";

const ROLE_ORDER = ["Admin", "Engineer", "Inspector"];
const ROLE_VARIANT = { Admin: "danger", Engineer: "primary", Inspector: "info" };

const PROJECT_ORDER = ["Active", "On Hold", "Completed"];
const PROJECT_VARIANT = { Active: "success", "On Hold": "warning", Completed: "info" };

const INSPECTION_ORDER = [
    "Draft",
    "Images Uploaded",
    "Pending Analysis",
    "AI Processing",
    "AI Completed",
    "Validated",
    "Report Generated",
];
const INSPECTION_VARIANT = {
    Draft: "primary",
    "Images Uploaded": "info",
    "Pending Analysis": "warning",
    "AI Processing": "warning",
    "AI Completed": "info",
    Validated: "success",
    "Report Generated": "success",
};

const ANALYSIS_ORDER = ["Queued", "Processing", "Completed", "Failed", "Cancelled"];
const ANALYSIS_VARIANT = {
    Queued: "warning",
    Processing: "info",
    Completed: "success",
    Failed: "danger",
    Cancelled: "primary",
};

const formatAction = (action = "") =>
    action.replace(".", " · ").replace(/_/g, " ");

const formatDate = (value) =>
    new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });

/* Share-of-total bars, e.g. role / project / inspection status */
function DistributionWidget({ title, counts = {}, order, variants }) {
    const entries = order.map((key) => ({ key, value: counts[key] || 0 }));
    const total = entries.reduce((sum, item) => sum + item.value, 0);

    return (
        <WidgetCard title={title}>
            {total === 0 ? (
                <div className="inspection-list">No data yet</div>
            ) : (
                entries.map((item) => (
                    <ProgressBar
                        key={item.key}
                        label={`${item.key} (${item.value})`}
                        value={Math.round((item.value / total) * 100)}
                        variant={variants[item.key] || "primary"}
                    />
                ))
            )}
        </WidgetCard>
    );
}

function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const response = await getAdminDashboard();
                setData(response.data);
            } catch (err) {
                setError(getApiErrorMessage(err, "Failed to load dashboard."));
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const firstName = user?.name?.split(" ")[0] || "Admin";

    const header = (
        <PageHeader
            variant="dashboard"
            title={`Welcome, ${firstName}`}
            subtitle="System overview across users, teams, projects and analyses"
        >
            <button
                type="button"
                className="dashboard-action-btn"
                onClick={() => navigate(`${BASE}/users`)}
            >
                <FontAwesomeIcon icon={faUserPlus} />
                <span>Invite User</span>
            </button>
        </PageHeader>
    );

    if (loading) {
        return (
            <>
                {header}
                <div className="projects-loading">Loading dashboard...</div>
            </>
        );
    }

    if (error || !data) {
        return (
            <>
                {header}
                <p className="form-error">{error || "No data available."}</p>
            </>
        );
    }

    const { users, teams, projects, inspections, analyses, reports } = data;

    const attention = [
        { label: "Teams without a lead", count: teams?.withoutLead, to: "teams", variant: "warning" },
        { label: "Unassigned projects", count: projects?.unassigned, to: "projects", variant: "warning" },
        { label: "Stuck analyses", count: analyses?.stuck, to: "analyses", variant: "danger" },
        { label: "Awaiting validation", count: analyses?.awaitingValidation, to: "analyses", variant: "info" },
        { label: "Pending invitations", count: users?.pendingInvitations, to: "users", variant: "info" },
        { label: "Deactivated accounts", count: users?.inactive, to: "users", variant: "primary" },
    ].filter((item) => item.count > 0);

    const recent = data.recentActivity || [];

    return (
        <>
            {header}

            <AiSimulatedBanner aiMode={data.aiMode} disclaimer={data.aiDisclaimer} />

            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                <StatsGrid>
                    <StatsCard
                        title="Total Users"
                        value={users?.total ?? 0}
                        icon={faUsers}
                        iconVariant="primary"
                        onClick={() => navigate(`${BASE}/users`)}
                    />
                    <StatsCard
                        title="Active Projects"
                        value={projects?.byStatus?.Active ?? 0}
                        icon={faFolderOpen}
                        iconVariant="success"
                        onClick={() => navigate(`${BASE}/projects`)}
                    />
                    <StatsCard
                        title="Teams"
                        value={teams?.total ?? 0}
                        icon={faPeopleGroup}
                        iconVariant="info"
                        onClick={() => navigate(`${BASE}/teams`)}
                    />
                    <StatsCard
                        title="Reports Generated"
                        value={reports?.total ?? 0}
                        icon={faFileLines}
                        iconVariant="warning"
                        onClick={() => navigate(`${BASE}/reports`)}
                    />
                </StatsGrid>
            </motion.div>

            <motion.section
                className="dashboard-widgets"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
            >
                <DashboardGrid>
                    <WidgetCard title="Needs Attention">
                        {attention.length === 0 ? (
                            <div className="inspection-list">Nothing needs attention right now</div>
                        ) : (
                            <motion.ul
                                className="queue-list"
                                variants={staggerContainer}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                {attention.map((item) => (
                                    <motion.li
                                        key={item.label}
                                        className="queue-item"
                                        variants={fadeInUp}
                                        style={{ cursor: "pointer" }}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => navigate(`${BASE}/${item.to}`)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter" || event.key === " ") {
                                                event.preventDefault();
                                                navigate(`${BASE}/${item.to}`);
                                            }
                                        }}
                                    >
                                        <div className="queue-info">
                                            <span className="queue-project">{item.label}</span>
                                        </div>
                                        <StatusBadge text={String(item.count)} variant={item.variant} />
                                    </motion.li>
                                ))}
                            </motion.ul>
                        )}
                    </WidgetCard>

                    <DistributionWidget
                        title="Role Distribution"
                        counts={users?.byRole}
                        order={ROLE_ORDER}
                        variants={ROLE_VARIANT}
                    />

                    <DistributionWidget
                        title="Project Status"
                        counts={projects?.byStatus}
                        order={PROJECT_ORDER}
                        variants={PROJECT_VARIANT}
                    />

                    <DistributionWidget
                        title="Inspection Status"
                        counts={inspections?.byStatus}
                        order={INSPECTION_ORDER}
                        variants={INSPECTION_VARIANT}
                    />

                    <WidgetCard title="Analysis Processing">
                        <motion.ul
                            className="queue-list"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            {ANALYSIS_ORDER.map((status) => (
                                <motion.li key={status} className="queue-item" variants={fadeInUp}>
                                    <div className="queue-info">
                                        <span className="queue-project">{status}</span>
                                    </div>
                                    <StatusBadge
                                        text={String(analyses?.byStatus?.[status] ?? 0)}
                                        variant={ANALYSIS_VARIANT[status]}
                                    />
                                </motion.li>
                            ))}
                        </motion.ul>
                    </WidgetCard>

                    <WidgetCard
                        title="Recent Activity"
                        headerAction={
                            <button
                                type="button"
                                className="btn-ghost btn-sm"
                                onClick={() => navigate(`${BASE}/activity-log`)}
                            >
                                View all
                            </button>
                        }
                    >
                        {recent.length === 0 ? (
                            <div className="approval-list">No recent activity</div>
                        ) : (
                            <motion.ul
                                className="approval-list"
                                variants={staggerContainer}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                {recent.map((entry) => (
                                    <motion.li key={entry._id} className="approval-item" variants={fadeInUp}>
                                        <div className="approval-info">
                                            <div className="approval-project">
                                                {entry.message || formatAction(entry.action)}
                                            </div>
                                            <div className="approval-engineer">
                                                {entry.actor?.name || entry.actorRole}
                                            </div>
                                        </div>

                                        {entry.outcome === "failure" && (
                                            <StatusBadge text="Failed" variant="danger" />
                                        )}

                                        <time className="approval-date" dateTime={entry.createdAt}>
                                            {formatDate(entry.createdAt)}
                                        </time>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        )}
                    </WidgetCard>
                </DashboardGrid>
            </motion.section>
        </>
    );
}

export default AdminDashboard;