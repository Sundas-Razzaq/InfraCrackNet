import WidgetCard from "../../shared/widgetCard";
import ProgressBar from "../../cards/progressBar";
import { motion } from "framer-motion";

function StructuralRiskWidget() {
    const riskItems = [
        {
            label: "High Risk",
            value: 92,
            variant: "danger",
        },
        {
            label: "Medium Risk",
            value: 74,
            variant: "warning",
        },
        {
            label: "Low Risk",
            value: 45,
            variant: "success",
        },
    ];

    return (
        <WidgetCard title="Structural Risk Monitor">
            <div className="risk-list">
                {riskItems.map((item, index) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.45,
                            delay: index * 0.12,
                            ease: "easeOut",
                        }}
                        viewport={{ once: true }}
                    >
                        <ProgressBar
                            label={item.label}
                            value={item.value}
                            variant={item.variant}
                        />
                    </motion.div>
                ))}
            </div>
        </WidgetCard>
    );
}

export default StructuralRiskWidget;
