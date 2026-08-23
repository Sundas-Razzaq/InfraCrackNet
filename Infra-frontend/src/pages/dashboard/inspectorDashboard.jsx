import PageHeader from "../../components/dashboard/shared/PageHeader";
import StatsGrid from "../../components/dashboard/shared/StatsGrid";
import StatsCard from "../../components/dashboard/cards/StatsCard";
import DashboardGrid from "../../components/dashboard/shared/dashboardGrid";

import ActiveInspectionWidget from "../../components/dashboard/widgets/inspector/ActiveInspectionWidget";
import QuickUploadWidget from "../../components/dashboard/widgets/inspector/QuickUploadWidget";
import ReminderWidget from "../../components/dashboard/widgets/inspector/ReminderWidget";
import RecentInspectionWidget from "../../components/dashboard/widgets/inspector/RecentInspectionWidget";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInspections } from "../../api/inspectionApi";
import { getUploadedImageCount } from "../../api/inspectionImageApi";
import { getReportCount } from "../../api/reportApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faClipboardList,
    faImages,
    faCloudArrowUp,
    faFileCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

import { motion } from "framer-motion";
import {
    fadeInUp,
    staggerContainer,
} from "../../utils/animation";

function InspectorDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [inspections, setInspections] = useState([]);
    useEffect(() => {
        const fetchInspections = async () => {
            try {
                const response = await getInspections();
                setInspections(response.data || []);
            } catch (error) {
                console.error("Failed to fetch inspections:", error);
            }
        };

        fetchInspections();
    }, []);
    const [uploadedImageCount, setUploadedImageCount] = useState(0);
    useEffect(() => {
        const fetchUploadedImageCount = async () => {
            try {
                const response = await getUploadedImageCount();

                setUploadedImageCount(response.count || 0);
            } catch (error) {
                console.error(
                    "Failed to fetch uploaded image count:",
                    error
                );
            }
        };

        fetchUploadedImageCount();
    }, []);

    const [reportCount, setReportCount] = useState(0);
    useEffect(() => {
        const fetchReportCount = async () => {
            try {
                const response = await getReportCount();

                setReportCount(response.count || 0);
            } catch (error) {
                console.error(
                    "Failed to fetch report count:",
                    error
                );
            }
        };

        fetchReportCount();
    }, []);
    const activeInspectionCount = inspections.filter(
        (inspection) => inspection.status !== "Completed"
    ).length;

    const pendingUploadCount = inspections.filter(
        (inspection) => inspection.status === "Draft"
    ).length;
    return (
        <>
            <PageHeader
                variant="dashboard"
                title={`Good Morning, ${user?.name?.split(" ")[0]}`}
                subtitle="Here's what needs your attention"
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
                        title="Active Inspections"
                        value={activeInspectionCount}
                        icon={faClipboardList}
                        iconVariant="primary"
                        onClick={() => navigate("/dashboard/inspection")}
                    />

                    <StatsCard
                        title="Images Uploaded"
                        value={uploadedImageCount}
                        icon={faImages}
                        iconVariant="success"
                    />

                    <StatsCard
                        title="Pending Upload"
                        value={pendingUploadCount}
                        icon={faCloudArrowUp}
                        iconVariant="warning"
                        onClick={() => navigate("/dashboard/inspection/drafts")}
                    />

                    <StatsCard
                        title="Reports Ready"
                        value={reportCount}
                        icon={faFileCircleCheck}
                        iconVariant="info"
                        onClick={() => navigate("/dashboard/reports")}
                    />
                </StatsGrid>
            </motion.div >

            <motion.section className="dashboard-widgets"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
            >
                <DashboardGrid>
                    <ActiveInspectionWidget />
                    <QuickUploadWidget />
                </DashboardGrid>
            </motion.section>

            <motion.section className="dashboard-reminder"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
            >
                <ReminderWidget />
            </motion.section>

            <motion.section className="dashboard-table"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
            >
                <RecentInspectionWidget />
            </motion.section>
        </>
    );
}

export default InspectorDashboard;