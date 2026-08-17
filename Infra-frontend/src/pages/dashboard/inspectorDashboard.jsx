import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/dashboard/shared/PageHeader";
import StatsGrid from "../../components/dashboard/shared/StatsGrid";
import StatsCard from "../../components/dashboard/cards/StatsCard";
import DashboardGrid from "../../components/dashboard/shared/dashboardGrid";

import ActiveInspectionWidget from "../../components/dashboard/widgets/inspector/ActiveInspectionWidget";
import QuickUploadWidget from "../../components/dashboard/widgets/inspector/QuickUploadWidget";
import ReminderWidget from "../../components/dashboard/widgets/inspector/ReminderWidget";
import RecentInspectionWidget from "../../components/dashboard/widgets/inspector/RecentInspectionWidget";
import { useAuth } from "../../context/useAuth";
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
                        title="Active Inspections"
                        value="3"
                        description="2 in progress"
                        icon={faClipboardList}
                        iconVariant="primary"
                    />

                    <StatsCard
                        title="Images Uploaded"
                        value="127"
                        description="24 today"
                        icon={faImages}
                        iconVariant="success"
                    />

                    <StatsCard
                        title="Pending Upload"
                        value="2"
                        description="Complete today"
                        icon={faCloudArrowUp}
                        iconVariant="warning"
                    />

                    <StatsCard
                        title="Reports Ready"
                        value="8"
                        description="To validate"
                        icon={faFileCircleCheck}
                        iconVariant="info"
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