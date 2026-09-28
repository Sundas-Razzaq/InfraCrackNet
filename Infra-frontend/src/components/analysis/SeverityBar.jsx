const SeverityBar = ({ summary, cracks = [] }) => {
    const severity = summary?.overallSeverity || "Low";
    const riskScore = summary?.riskScore || 0;

    const riskClass =
        riskScore >= 75
            ? "risk-critical"
            : riskScore >= 50
                ? "risk-high"
                : riskScore >= 25
                    ? "risk-medium"
                    : "risk-low";

    const levels = ["Critical", "High", "Medium", "Low"];

    const counts = levels.map((level) => ({
        level,
        count: cracks.filter((c) => c.severity === level).length,
    }));

    return (
        <div className="severity-card">

            <div className="severity-header">
                <div>
                    <h3>Risk Assessment</h3>
                    <p>Overall severity of this inspection</p>
                </div>
            </div>

            <div className="severity-level">
                <span
                    className={`severity-badge severity-${severity.toLowerCase()}`}
                >
                    {severity}
                </span>
            </div>

            <div className="severity-progress">
                <div
                    className={`severity-progress-fill ${riskClass}`}
                    style={{
                        width: `${riskScore}%`,
                    }}
                />
            </div>

            <div className="severity-footer">
                <span>Risk Score</span>
                <strong>{riskScore}%</strong>
            </div>

            <div className="severity-breakdown">
                <h4>Severity Breakdown</h4>

                {counts.map(({ level, count }) => (
                    <div key={level} className="breakdown-row">
                        <span className="breakdown-name">{level}</span>

                        <div className="breakdown-track">
                            <div
                                className={`breakdown-fill dot-${level.toLowerCase()}`}
                                style={{
                                    width: cracks.length
                                        ? `${(count / cracks.length) * 100}%`
                                        : "0%",
                                }}
                            />
                        </div>

                        <strong>{count}</strong>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default SeverityBar;