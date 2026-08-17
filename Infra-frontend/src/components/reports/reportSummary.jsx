const ReportSummary = ({ report, analysis }) => {
    return (
        <section className="report-summary">
            <div className="report-summary-header">
                <div>
                    <span className="report-section-label">
                        Report Summary
                    </span>

                    <h2>
                        {report?.reportCode || "Report"}
                    </h2>
                </div>

                <div className="report-summary-date">
                    <span className="detail-label">
                        Generated On
                    </span>

                    <strong>
                        {report?.generatedAt
                            ? new Date(
                                report.generatedAt
                            ).toLocaleDateString(
                                "en-US",
                                {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                }
                            )
                            : "—"}
                    </strong>
                </div>
            </div>

            <div className="report-summary-grid">
                <div className="report-summary-item">
                    <span className="detail-label">
                        Analysis Code
                    </span>

                    <strong>
                        {analysis?.analysisCode || "—"}
                    </strong>
                </div>

                <div className="report-summary-item">
                    <span className="detail-label">
                        Overall Severity
                    </span>

                    <strong>
                        {analysis?.overallSeverity ||
                            "Not available"}
                    </strong>
                </div>

                <div className="report-summary-item">
                    <span className="detail-label">
                        Risk Score
                    </span>

                    <strong>
                        {analysis?.riskScore != null
                            ? `${analysis.riskScore}%`
                            : "—"}
                    </strong>
                </div>

                <div className="report-summary-item">
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
            </div>
        </section>
    );
};

export default ReportSummary;