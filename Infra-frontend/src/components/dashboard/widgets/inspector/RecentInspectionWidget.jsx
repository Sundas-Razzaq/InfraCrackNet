import WidgetCard from "../../shared/widgetCard";
import StatusBadge from "../../cards/statusBadge";
import { motion } from "framer-motion";
import { fadeInUp } from "../../../../utils/animation";
import { getAllAnalysis } from "../../../../api/analysisApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RecentInspectionWidget() {
    const [recentInspections, setRecentInspections] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getStatusConfig = (status) => {
        const configs = {
            "Images Uploaded": {
                text: "In Progress",
                variant: "info",
            },
            "AI Processing": {
                text: "Processing",
                variant: "warning",
            },
            "AI Completed": {
                text: "AI Complete",
                variant: "success",
            },
            Validated: {
                text: "Validated",
                variant: "success",
            },
            "Report Generated": {
                text: "Report Ready",
                variant: "primary",
            },
            Completed: {
                text: "Complete",
                variant: "success",
            },
        };

        return (
            configs[status] || {
                text: status || "Unknown",
                variant: "secondary",
            }
        );
    };

    const getSeverityConfig = (severity) => {
        const configs = {
            Low: {
                text: "Low",
                variant: "success",
            },
            Medium: {
                text: "Medium",
                variant: "warning",
            },
            High: {
                text: "High",
                variant: "danger",
            },
            Critical: {
                text: "Critical",
                variant: "danger",
            },
        };

        return (
            configs[severity] || {
                text: "N/A",
                variant: "secondary",
            }
        );
    };

    useEffect(() => {
        const fetchRecentInspections = async () => {
            try {
                const response = await getAllAnalysis();

                const analyses = response.data || [];

                const recent = analyses
                    .filter((analysis) => analysis.inspection)
                    .slice(0, 4)
                    .map((analysis) => ({
                        inspectionId: analysis.inspection._id,
                        id: analysis.inspection.inspectionCode,
                        location: analysis.inspection.structureArea,
                        date: new Date(
                            analysis.createdAt
                        ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                        }),
                        status: getStatusConfig(
                            analysis.inspection.status
                        ),
                        severity: getSeverityConfig(
                            analysis.overallSeverity
                        ),
                    }));

                setRecentInspections(recent);
            } catch (error) {
                console.error(
                    "Failed to fetch recent inspections:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRecentInspections();
    }, []);
    if (loading) {
        return (
            <WidgetCard title="Recent Inspections">
                <div className="inspection-list">
                    Loading...
                </div>
            </WidgetCard>
        );
    }

    return (
        <WidgetCard title="Recent Inspections">
            <table className="inspection-table">

                <thead className="inspection-table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Location</th>
                        <th scope="col">Date</th>
                        <th scope="col">Status</th>
                        <th scope="col">Severity</th>
                    </tr>
                </thead>

                {recentInspections.length === 0 ? (
                    <tbody>
                        <tr>
                            <td
                                colSpan="5"
                                className="inspection-cell"
                            >
                                No recent inspections
                            </td>
                        </tr>
                    </tbody>
                ) : (
                    <tbody className="inspection-table-body">
                        {recentInspections.map((inspection, index) => (
                            <motion.tr
                                key={inspection.id}
                                className="inspection-row"
                                onClick={() =>
                                    navigate(
                                        `/dashboard/inspection/${inspection.inspectionId}`
                                    )
                                }
                                variants={fadeInUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08 }}
                            >
                                <td className="inspection-cell">
                                    {inspection.id}
                                </td>

                                <td className="inspection-cell">
                                    {inspection.location}
                                </td>

                                <td className="inspection-cell">
                                    {inspection.date}
                                </td>

                                <td className="inspection-cell">
                                    <StatusBadge
                                        text={inspection.status.text}
                                        variant={inspection.status.variant}
                                    />
                                </td>

                                <td className="inspection-cell">
                                    <StatusBadge
                                        text={inspection.severity.text}
                                        variant={inspection.severity.variant}
                                    />
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                )}

            </table>
        </WidgetCard>
    );
}

export default RecentInspectionWidget;