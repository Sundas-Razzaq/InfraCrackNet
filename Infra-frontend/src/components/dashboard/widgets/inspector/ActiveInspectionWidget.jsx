import WidgetCard from "../../shared/widgetCard";
import StatusBadge from "../../cards/statusBadge";
import { motion } from "framer-motion";
import {
    staggerContainer,
    fadeInUp,
} from "../../../../utils/animation";
import { getInspections } from "../../../../api/inspectionApi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ActiveInspectionWidget() {
    const navigate = useNavigate();
    const [activeInspections, setActiveInspections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActiveInspections = async () => {
            try {
                const response = await getInspections();
                // Filter out Draft and Completed inspections
                const filtered = response.data.filter(
                    (inspection) =>
                        inspection.status !== "Draft" &&
                        inspection.status !== "Completed"
                );
                setActiveInspections(filtered);
            } catch (error) {
                console.error("Failed to fetch inspections:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActiveInspections();
    }, []);

    const getStatusConfig = (status) => {
        const configs = {
            "Images Uploaded": { text: "In Progress", variant: "info" },
            "AI Processing": { text: "Processing", variant: "warning" },
            "AI Completed": { text: "AI Complete", variant: "success" },
            "Validated": { text: "Validated", variant: "success" },
            "Report Generated": { text: "Report Ready", variant: "info" },
        };
        return configs[status] || { text: status, variant: "secondary" };
    };

    // Show loading state
    if (loading) {
        return (
            <WidgetCard title="Active Inspections">
                <div className="inspection-list">Loading...</div>
            </WidgetCard>
        );
    }

    return (
        <WidgetCard
            title="Active Inspections"
            onClick={() => navigate("/dashboard/inspection")}
        >
            {activeInspections.length === 0 ? (
                <div className="inspection-list">No active inspections</div>
            ) : (
                <motion.ul
                    className="inspection-list"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {activeInspections.slice(0, 3).map((inspection) => {
                        const statusConfig = getStatusConfig(inspection.status);
                        return (
                            <motion.li
                                key={inspection.inspectionCode}
                                className="inspection-item"
                                variants={fadeInUp}
                            >
                                <div className="inspection-top">
                                    <span className="inspection-id">
                                        {inspection.inspectionCode}
                                    </span>
                                    <StatusBadge
                                        text={statusConfig.text}
                                        variant={statusConfig.variant}
                                    />
                                </div>

                                <div className="inspection-location">
                                    {inspection.structureArea}
                                </div>
                            </motion.li>
                        );
                    })}
                </motion.ul>
            )}
        </WidgetCard>
    );
}

export default ActiveInspectionWidget;