import WidgetCard from "../../shared/widgetCard";
import StatusBadge from "../../cards/statusBadge";
import { motion } from "framer-motion";
import {
    staggerContainer,
    fadeInUp,
} from "../../../../utils/animation";
import { getAllAnalysis } from "../../../../api/analysisApi";
import { useEffect, useState } from "react";

function RecentApprovalsWidget() {
    const [approvals, setApprovals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentApprovals = async () => {
            try {
                const response = await getAllAnalysis();

                const analyses = response.data || [];

                const recentApprovals = analyses
                    .filter(
                        (analysis) =>
                            analysis.validationStatus === "Approved"
                    )
                    .sort(
                        (a, b) =>
                            new Date(b.validatedAt) -
                            new Date(a.validatedAt)
                    )
                    .slice(0, 4)
                    .map((analysis) => ({
                        id: analysis.analysisCode,
                        projectName:
                            analysis.inspection?.project?.name ||
                            "Unknown Project",
                        approverName:
                            analysis.validatedBy?.name ||
                            "Unknown User",
                        approvalDate: new Date(
                            analysis.validatedAt
                        ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                        }),
                        status: {
                            text: "Approved",
                            variant: "success",
                        },
                    }));

                setApprovals(recentApprovals);
            } catch (error) {
                console.error(
                    "Failed to fetch recent approvals:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRecentApprovals();
    }, []);

    if (loading) {
        return (
            <WidgetCard title="Recent Approvals">
                <div className="approval-list">
                    Loading...
                </div>
            </WidgetCard>
        );
    }

    return (
        <WidgetCard title="Recent Approvals">
            {approvals.length === 0 ? (
                <div className="approval-list">
                    No recent approvals
                </div>
            ) : (
                <motion.ul
                    className="approval-list"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.2,
                    }}
                >
                    {approvals.map((approval) => (
                        <motion.li
                            key={approval.id}
                            className="approval-item"
                            variants={fadeInUp}
                        >
                            <div className="approval-info">
                                <div className="approval-project">
                                    {approval.projectName}
                                </div>

                                <div className="approval-engineer">
                                    AI Analysis {approval.approverName}
                                </div>
                            </div>

                            <StatusBadge
                                text={approval.status.text}
                                variant={approval.status.variant}
                            />

                            <time
                                className="approval-date"
                                dateTime={approval.approvalDate}
                            >
                                {approval.approvalDate}
                            </time>
                        </motion.li>
                    ))}
                </motion.ul>
            )}
        </WidgetCard>
    );
}

export default RecentApprovalsWidget;