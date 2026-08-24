import WidgetCard from "../../shared/widgetCard";
import StatusBadge from "../../cards/statusBadge";
import { motion } from "framer-motion";
import {
    staggerContainer,
    fadeInUp,
} from "../../../../utils/animation";
import { getAllAnalysis } from "../../../../api/analysisApi";
import { useEffect, useState } from "react";

function AIQueueWidget() {
    const [queueItems, setQueueItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const getStatusConfig = (status) => {
        const configs = {
            Queued: {
                text: "Pending",
                variant: "warning",
            },
            Processing: {
                text: "In Progress",
                variant: "info",
            },
        };

        return (
            configs[status] || {
                text: status || "Unknown",
                variant: "secondary",
            }
        );
    };

    useEffect(() => {
        const fetchAIQueue = async () => {
            try {
                const response = await getAllAnalysis();
                const analyses = response.data || [];

                const queue = analyses
                    .filter(
                        (analysis) =>
                            analysis.status === "Queued" ||
                            analysis.status === "Processing"
                    )
                    .slice(0, 4)
                    .map((analysis) => ({
                        id:
                            analysis.inspection?.inspectionCode ||
                            analysis.analysisCode,

                        projectName:
                            analysis.inspection?.project?.name ||
                            analysis.inspection?.structureArea ||
                            "Unknown",

                        priority:
                            analysis.inspection?.project?.priority ||
                            "Medium",

                        status: getStatusConfig(
                            analysis.status
                        ),
                    }));

                setQueueItems(queue);
            } catch (error) {
                console.error(
                    "Failed to fetch AI analysis queue:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAIQueue();
    }, []);

    if (loading) {
        return (
            <WidgetCard title="AI Analysis Queue">
                <div className="inspection-list">
                    Loading...
                </div>
            </WidgetCard>
        );
    }

    return (
        <WidgetCard title="AI Analysis Queue">
            {queueItems.length === 0 ? (
                <div className="inspection-list">
                    No analyses in queue
                </div>
            ) : (
                <motion.ul
                    className="queue-list"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.2,
                    }}
                >
                    {queueItems.map((item) => (
                        <motion.li
                            key={item.id}
                            className="queue-item"
                            variants={fadeInUp}
                        >
                            <div className="queue-info">
                                <span className="queue-id">
                                    {item.id}
                                </span>

                                <span className="queue-project">
                                    {item.projectName}
                                </span>

                                <span className="queue-priority">
                                    {item.priority}
                                </span>
                            </div>

                            <StatusBadge
                                text={item.status.text}
                                variant={item.status.variant}
                            />
                        </motion.li>
                    ))}
                </motion.ul>
            )}
        </WidgetCard>
    );
}

export default AIQueueWidget;