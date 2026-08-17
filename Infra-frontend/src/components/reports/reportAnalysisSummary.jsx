const ReportAnalysisSummary = ({ analysis, cracks = [] }) => {
    const getSeverityClass = (severity) => {
        if (!severity) return "unknown";

        return severity.toLowerCase();
    };

    return (
        <section className="report-analysis-section">
            <div className="report-section-heading">
                <h2>AI Analysis Summary</h2>
            </div>

            <div className="report-analysis-grid">
                <div className="report-analysis-card">
                    <span className="detail-label">
                        Total Images
                    </span>

                    <strong>
                        {analysis?.totalImages ?? "—"}
                    </strong>
                </div>

                <div className="report-analysis-card">
                    <span className="detail-label">
                        Detected Cracks
                    </span>

                    <strong>
                        {cracks.length}
                    </strong>
                </div>

                <div className="report-analysis-card">
                    <span className="detail-label">
                        Average Confidence
                    </span>

                    <strong>
                        {analysis?.averageConfidence != null
                            ? `${analysis.averageConfidence.toFixed(
                                2
                            )}%`
                            : "—"}
                    </strong>
                </div>

                <div className="report-analysis-card">
                    <span className="detail-label">
                        Overall Severity
                    </span>

                    <span
                        className={`report-severity ${getSeverityClass(
                            analysis?.overallSeverity
                        )}`}
                    >
                        {analysis?.overallSeverity ||
                            "Not available"}
                    </span>
                </div>

                <div className="report-analysis-card">
                    <span className="detail-label">
                        Risk Score
                    </span>

                    <strong>
                        {analysis?.riskScore != null
                            ? `${analysis.riskScore}%`
                            : "—"}
                    </strong>
                </div>

                <div className="report-analysis-card">
                    <span className="detail-label">
                        Analysis Status
                    </span>

                    <strong>
                        {analysis?.status || "—"}
                    </strong>
                </div>
            </div>
        </section>
    );
};

export default ReportAnalysisSummary;