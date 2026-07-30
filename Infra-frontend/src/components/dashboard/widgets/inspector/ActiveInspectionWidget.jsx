import WidgetCard from "../../shared/widgetCard";
import StatusBadge from "../../cards/statusBadge";
import { motion } from "framer-motion";
import {
    staggerContainer,
    fadeInUp,
} from "../../../../utils/animation";

function ActiveInspectionWidget() {
    const activeInspections = [
        {
            id: "INS-2024",
            location: "North Bridge Sector A",
            progress: "8/12 Images",
            status: {
                text: "In Progress",
                variant: "info",
            },
        },
        {
            id: "INS-2025",
            location: "Highway Pillar B3",
            progress: "5/10 Images",
            status: {
                text: "Uploading",
                variant: "warning",
            },
        },
        {
            id: "INS-2026",
            location: "Tunnel Wall East",
            progress: "11/15 Images",
            status: {
                text: "Review",
                variant: "primary",
            },
        },
    ];

    return (
        <WidgetCard title="Active Inspections">
            <motion.ul className="inspection-list"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {activeInspections.map((inspection) => (
                    <motion.li key={inspection.id} className="inspection-item" variants={fadeInUp}>
                        <div className="inspection-top">
                            <span className="inspection-id">
                                {inspection.id}
                            </span>

                            <StatusBadge
                                text={inspection.status.text}
                                variant={inspection.status.variant}
                            />
                        </div>

                        <div className="inspection-location">
                            {inspection.location}
                        </div>

                        <div className="inspection-progress">
                            {inspection.progress}
                        </div>
                    </motion.li>
                ))}
            </motion.ul>
        </WidgetCard>
    );
}

export default ActiveInspectionWidget;