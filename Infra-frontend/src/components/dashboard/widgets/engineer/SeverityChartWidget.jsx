import WidgetCard from "../../shared/widgetCard";

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
                {severityData.map((item) => (
                    <div key={item.label} className="severity-column">
                        <div className="severity-bar-wrapper">
                            <div
                                className={`severity-bar ${item.variant}`}
                                style={{ height: `${item.value}%` }}
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