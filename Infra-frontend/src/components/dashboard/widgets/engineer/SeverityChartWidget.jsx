import WidgetCard from "../../shared/widgetCard";
import { motion } from "framer-motion";
function SeverityDistributionWidget() {
    const severityData = [
        {
            label: "Low",
            value: 68,
            variant: "success",
        },
        {
            label: "Medium",
            value: 86,
            variant: "warning",
        },
        {
            label: "High",
            value: 55,
            variant: "danger",
        },
        {
            label: "Critical",
            value: 22,
            variant: "critical",
        },
    ];

    return (
        <WidgetCard title="Severity Distribution (This Month)">
            <div className="severity-chart">
                {severityData.map((item, index) => (
                    <div key={item.label} className="severity-column">
                        <div className="severity-bar-wrapper">
                            <motion.div
                                className={`severity-bar ${item.variant}`}
                                initial={{ height: 0, opacity: 0 }}
                                whileInView={{ height: `${item.value}%`, opacity: 1 }}
                                transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
                                viewport={{ once: true }}
                            />
                        </div>

                        <span className="severity-label">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </WidgetCard>
    );
}

export default SeverityDistributionWidget;