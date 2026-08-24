import PageHeader from "../../components/dashboard/shared/PageHeader";
import StatsGrid from "../../components/dashboard/shared/StatsGrid";
import StatsCard from "../../components/dashboard/cards/StatsCard";
import DashboardGrid from "../../components/dashboard/shared/dashboardGrid";

import AIQueueWidget from "../../components/dashboard/widgets/engineer/AIQueueWidget";
import SeverityChartWidget from "../../components/dashboard/widgets/engineer/SeverityChartWidget";
import RiskWidget from "../../components/dashboard/widgets/engineer/StructuralRiskWidget";
import Approvals from "../../components/dashboard/widgets/engineer/RecentApprovalsWidget";
import { useEffect, useState } from "react";
import { getAllAnalysis } from "../../api/analysisApi";
import { getAllReports } from "../../api/reportApi";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
    const [aiQueueCount, setAiQueueCount] = useState(0);
    const [pendingReviewCount, setPendingReviewCount] = useState(0);
    const [reportsGeneratedCount, setReportsGeneratedCount] = useState(0);
    const [criticalFindingsCount, setCriticalFindingsCount] = useState(0);

    useEffect(() => {
        const fetchAIQueue = async () => {
            try {
                const response = await getAllAnalysis();
                const analyses = response.data || [];

                const queueCount = analyses.filter(
                    (analysis) =>
                        analysis.status === "Queued" ||
                        analysis.status === "Processing"
                ).length;

                setAiQueueCount(queueCount);
                const pendingReviewCount = analyses.filter(
                    (analysis) =>
                        analysis.status === "Completed" &&
                        analysis.validationStatus === "Pending"
                ).length;

                setPendingReviewCount(pendingReviewCount);
                const criticalFindingsCount = analyses.filter(
                    (analysis) =>
                        analysis.status === "Completed" &&
                        analysis.overallSeverity === "Critical"
                ).length;

                setCriticalFindingsCount(criticalFindingsCount);
            } catch (error) {
                console.error(
                    "Failed to fetch AI queue:",
                    error
                );
            }
        };

        fetchAIQueue();
    }, []);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await getAllReports();

                setReportsGeneratedCount(
                    response.count || 0
                );
            } catch (error) {
                console.error(
                    "Failed to fetch reports:",
                    error
                );
            }
        };

        fetchReports();
    }, []);

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
                    onClick={() => navigate("/dashboard/inspection/new")}
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
                        value={aiQueueCount}
                        icon={faRobot}
                        iconVariant="primary"
                    />

                    <StatsCard
                        title="Pending Review"
                        value={pendingReviewCount}
                        icon={faClipboardCheck}
                        iconVariant="warning"
                    />

                    <StatsCard
                        title="Reports Generated"
                        value={reportsGeneratedCount}
                        icon={faFileLines}
                        iconVariant="success"
                        onClick={() => navigate("/dashboard/reports")}
                    />

                    <StatsCard
                        title="Critical Findings"
                        value={criticalFindingsCount}
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