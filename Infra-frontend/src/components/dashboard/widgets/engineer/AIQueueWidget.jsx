import WidgetCard from "../../shared/widgetCard";
import StatusBadge from "../../cards/statusBadge";
import { motion } from "framer-motion";
import {
    staggerContainer,
    fadeInUp,
} from "../../../../utils/animation";

function AIQueueWidget() {
    const queueItems = [
        {
            id: "INS-2024",
            projectName: "North Bridge Sector A",
            priority: "Critical",
            status: { text: "Review", variant: "danger" },
        },
        {
            id: "INS-2023",
            projectName: "Highway Pillar B3",
            priority: "High",
            status: { text: "Pending", variant: "warning" },
        },
        {
            id: "INS-2021",
            projectName: "Tunnel Wall East",
            priority: "Medium",
            status: { text: "In Progress", variant: "info" },
        },
        {
            id: "INS-2020",
            projectName: "Dam Face Section 2",
            priority: "Low",
            status: { text: "Complete", variant: "success" },
        },
    ];

    return (
        <WidgetCard title="AI Analysis Queue">
            <motion.ul className="queue-list"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {queueItems.map((item) => (
                    <motion.li key={item.id} className="queue-item" variants={fadeInUp}>
                        <div className="queue-info">
                            <span className="queue-id">{item.id}</span>
                            <span className="queue-project">{item.projectName}</span>
                            <span className="queue-priority">{item.priority}</span>
                        </div>

                        <StatusBadge text={item.status.text} variant={item.status.variant} />
                    </motion.li>
                ))}
            </motion.ul>
        </WidgetCard>
    );
}

export default AIQueueWidget;
