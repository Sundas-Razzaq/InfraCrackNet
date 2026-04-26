const defaultStats = [
    {
        value: "99.2%",
        label: "Detection Accuracy",
    },
    {
        value: "30ms",
        label: "Processing Latency",
    },
    {
        value: "15k+",
        label: "Inspections Completed",
    },
];

function StatsSection({ stats = defaultStats }) {
    return (
        <section className="landing-stats-section" aria-label="Platform performance metrics">
            <div className="landing-stats-container">
                {stats.map((stat, index) => (
                    <article
                        key={`${stat.value}-${stat.label}`}
                        className={`landing-stat-item ${index === stats.length - 1 ? "landing-stat-item-last" : ""}`}
                    >
                        <p className="landing-stat-value">{stat.value}</p>
                        <p className="landing-stat-label">{stat.label}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default StatsSection;
