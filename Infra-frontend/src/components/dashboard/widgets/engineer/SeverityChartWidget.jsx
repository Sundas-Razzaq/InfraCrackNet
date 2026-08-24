import WidgetCard from "../../shared/widgetCard";
import { motion } from "framer-motion";
import { getAllAnalysis } from "../../../../api/analysisApi";
import { useEffect, useState } from "react";

function SeverityDistributionWidget() {
    const [severityData, setSeverityData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSeverityData = async () => {
            try {
                const response = await getAllAnalysis();
                const analyses = response.data || [];

                // Get current month and year
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                // Only analyses created this month
                const monthlyAnalyses = analyses.filter((analysis) => {
                    const createdDate = new Date(analysis.createdAt);

                    return (
                        createdDate.getMonth() === currentMonth &&
                        createdDate.getFullYear() === currentYear
                    );
                });

                const severityCounts = {
                    Low: 0,
                    Medium: 0,
                    High: 0,
                    Critical: 0,
                };

                monthlyAnalyses.forEach((analysis) => {
                    if (severityCounts[analysis.overallSeverity] !== undefined) {
                        severityCounts[analysis.overallSeverity]++;
                    }
                });

                const totalAnalyses = monthlyAnalyses.length;

                const data = [
                    {
                        label: "Low",
                        value:
                            totalAnalyses > 0
                                ? (severityCounts.Low / totalAnalyses) * 100
                                : 0,
                        variant: "success",
                    },
                    {
                        label: "Medium",
                        value:
                            totalAnalyses > 0
                                ? (severityCounts.Medium / totalAnalyses) * 100
                                : 0,
                        variant: "warning",
                    },
                    {
                        label: "High",
                        value:
                            totalAnalyses > 0
                                ? (severityCounts.High / totalAnalyses) * 100
                                : 0,
                        variant: "danger",
                    },
                    {
                        label: "Critical",
                        value:
                            totalAnalyses > 0
                                ? (severityCounts.Critical / totalAnalyses) * 100
                                : 0,
                        variant: "critical",
                    },
                ];

                setSeverityData(data);
            } catch (error) {
                console.error(
                    "Failed to fetch severity distribution:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSeverityData();
    }, []);

    if (loading) {
        return (
            <WidgetCard title="Severity Distribution (This Month)">
                <div className="inspection-list">
                    Loading...
                </div>
            </WidgetCard>
        );
    }

    const hasData = severityData.some((item) => item.value > 0);

    return (
        <WidgetCard title="Severity Distribution (This Month)">
            {!hasData ? (
                <div className="inspection-list">
                    No analysis data available this month
                </div>
            ) : (
                <div className="severity-chart">
                    {severityData.map((item, index) => (
                        <div
                            key={item.label}
                            className="severity-column"
                        >
                            <div className="severity-bar-wrapper">
                                <motion.div
                                    className={`severity-bar ${item.variant}`}
                                    initial={{
                                        height: 0,
                                        opacity: 0,
                                    }}
                                    whileInView={{
                                        height: `${item.value}%`,
                                        opacity: 1,
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.12,
                                        ease: "easeOut",
                                    }}
                                    viewport={{ once: true }}
                                />
                            </div>

                            <span className="severity-label">
                                {item.label}
                            </span>

                            <span className="severity-value">
                                {Math.round(item.value)}%
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </WidgetCard>
    );
}

export default SeverityDistributionWidget;