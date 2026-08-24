import WidgetCard from "../../shared/widgetCard";
import ProgressBar from "../../cards/progressBar";
import { motion } from "framer-motion";
import { getAllAnalysis } from "../../../../api/analysisApi";
import { useEffect, useState } from "react";

function StructuralRiskWidget() {
    const [riskItems, setRiskItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const getRiskVariant = (score) => {
        if (score >= 70) {
            return "danger";
        }

        if (score >= 40) {
            return "warning";
        }

        return "success";
    };

    useEffect(() => {
        const fetchStructuralRisk = async () => {
            try {
                const response = await getAllAnalysis();
                const analyses = response.data || [];

                const highestRisk = analyses
                    .filter(
                        (analysis) =>
                            typeof analysis.riskScore === "number"
                    )
                    .sort(
                        (a, b) =>
                            b.riskScore - a.riskScore
                    )
                    .slice(0, 3)
                    .map((analysis) => ({
                        label:
                            analysis.inspection
                                ?.inspectionCode ||
                            analysis.analysisCode,
                        value: analysis.riskScore,
                        variant: getRiskVariant(
                            analysis.riskScore
                        ),
                    }));

                setRiskItems(highestRisk);
            } catch (error) {
                console.error(
                    "Failed to fetch structural risk data:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStructuralRisk();
    }, []);

    if (loading) {
        return (
            <WidgetCard title="Structural Risk Monitor">
                <div className="risk-list">
                    Loading...
                </div>
            </WidgetCard>
        );
    }

    return (
        <WidgetCard title="Structural Risk Monitor">
            <div className="risk-list">
                {riskItems.length === 0 ? (
                    <div className="risk-empty">
                        No risk data available
                    </div>
                ) : (
                    riskItems.map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{
                                opacity: 0,
                                y: 15,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
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
                    ))
                )}
            </div>
        </WidgetCard>
    );
}

export default StructuralRiskWidget;