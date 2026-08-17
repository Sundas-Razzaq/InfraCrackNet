import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/dashboard/shared/PageHeader";
import StatsGrid from "../../components/dashboard/shared/StatsGrid";
import StatsCard from "../../components/dashboard/cards/StatsCard";
import DashboardGrid from "../../components/dashboard/shared/dashboardGrid";

import AIQueueWidget from "../../components/dashboard/widgets/engineer/AIQueueWidget";
import SeverityChartWidget from "../../components/dashboard/widgets/engineer/SeverityChartWidget";
import RiskWidget from "../../components/dashboard/widgets/engineer/StructuralRiskWidget";
import Approvals from "../../components/dashboard/widgets/engineer/RecentApprovalsWidget";

import { useAuth } from "../../context/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faRobot,
    faClipboardCheck,
    faFileLines,
    faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

import { motion } from "framer-motion";
import {
    fadeInUp,
    staggerContainer,
} from "../../utils/animation";

function EngineerDashboard() {
    const { user } = useAuth();

    return (
        <>
            <PageHeader
                variant="dashboard"
                title={`Good Morning, ${user?.name?.split(" ")[0]}`}
                subtitle=" Here's what needs your attention"
            >
                <button
                    type="button"
                    className="dashboard-action-btn"
                    onClick={() => { }}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>New Inspection</span>
                </button>
            </PageHeader>
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
            >
                <StatsGrid>
                    <StatsCard
                        title="AI Queue"
                        value="8"
                        description="3 new today"
                        icon={faRobot}
                        iconVariant="primary"
                    />

                    <StatsCard
                        title="Pending Review"
                        value="12"
                        description="4 urgent"
                        icon={faClipboardCheck}
                        iconVariant="warning"
                    />

                    <StatsCard
                        title="Reports Generated"
                        value="47"
                        description="12% this week"
                        icon={faFileLines}
                        iconVariant="success"
                    />

                    <StatsCard
                        title="Critical Findings"
                        value="3"
                        description="Immediate review"
                        icon={faTriangleExclamation}
                        iconVariant="danger"
                    />
                </StatsGrid>
            </motion.div>

            <motion.section className="dashboard-widgets"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
            >
                <DashboardGrid>
                    <AIQueueWidget />
                    <SeverityChartWidget />
                    <RiskWidget />
                    <Approvals />
                </DashboardGrid>
            </motion.section>
        </>
    );
}

export default EngineerDashboard;