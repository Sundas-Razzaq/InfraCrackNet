const SeverityBar = ({ summary }) => {
    const severity = summary?.overallSeverity || "Low";
    const riskScore = summary?.riskScore || 0;

    return (
        <div className="severity-card">

            <div className="severity-level">
                <span
                    className={`severity-badge severity-${severity.toLowerCase()}`}
                >
                    {severity}
                </span>
            </div>

            <div className="severity-progress">
                <div
                    className="severity-progress-fill"
                    style={{
                        width: `${riskScore}%`,
                    }}
                />
            </div>

            <div className="severity-footer">
                <span>Risk Score</span>
                <strong>{riskScore}%</strong>
            </div>

        </div>
    );
};

export default SeverityBar;