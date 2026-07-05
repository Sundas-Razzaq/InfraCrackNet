import WidgetCard from "../../shared/widgetCard";
import ProgressBar from "../../cards/progressBar";

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
                {riskItems.map((item) => (
                    <ProgressBar
                        key={item.label}
                        label={item.label}
                        value={item.value}
                        variant={item.variant}
                    />
                ))}
            </div>
        </WidgetCard>
    );
}

export default StructuralRiskWidget;
