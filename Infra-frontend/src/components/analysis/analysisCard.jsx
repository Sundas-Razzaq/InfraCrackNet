import { useNavigate } from "react-router-dom";

const AnalysisCard = ({ analysis }) => {
    const navigate = useNavigate();

    const {
        _id,
        analysisCode,
        analysisVersion,
        status,
        validationStatus,
        averageConfidence,
        overallSeverity,
        riskScore,
        totalImages,
        inspection,
        createdAt,
    } = analysis;

    const handleClick = () => {
        navigate(`/dashboard/ai-analysis/${_id}`);
    };

    const getStatusClass = (value) => {
        switch (value) {
            case "Approved":
                return "status-badge status-approved";

            case "Rejected":
                return "status-badge status-rejected";

            case "Pending":
            default:
                return "status-badge status-pending";
        }
    };

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <article
            className="analysis-card"
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    handleClick();
                }
            }}
        >
            <div className="analysis-card-header">
                <div>
                    <span className="analysis-code">
                        {analysisCode}
                    </span>

                    <h3>
                        {inspection?.project?.name ||
                            "Unnamed Project"}
                    </h3>
                </div>

                <span className={getStatusClass(validationStatus)}>
                    {validationStatus || "Pending"}
                </span>

            </div>

            <div className="analysis-card-project">
                <span>
                    {inspection?.inspectionCode || "—"}
                </span>

                <span>
                    {inspection?.structureArea || "—"}
                </span>
            </div>

            <div className="analysis-card-divider" />

            <div className="analysis-card-details">
                <div>
                    <span className="detail-label">
                        Analysis Status
                    </span>

                    <strong>{status || "—"}</strong>
                </div>

                <div>
                    <span className="detail-label">
                        Version
                    </span>

                    <strong>
                        v{analysisVersion || 1}
                    </strong>
                </div>

                <div>
                    <span className="detail-label">
                        Images
                    </span>

                    <strong>
                        {totalImages ?? 0}
                    </strong>
                </div>

                <div>
                    <span className="detail-label">
                        Confidence
                    </span>

                    <strong>
                        {averageConfidence != null
                            ? `${averageConfidence.toFixed(2)}%`
                            : "—"}
                    </strong>
                </div>
            </div>

            <div className="analysis-card-footer">
                <div>
                    <span className="detail-label">
                        Severity
                    </span>

                    <span
                        className={`severity-badge ${overallSeverity
                            ? overallSeverity.toLowerCase()
                            : "unknown"
                            }`}
                    >
                        {overallSeverity || "Not available"}
                    </span>
                </div>

                <div>
                    <span className="detail-label">
                        Risk Score
                    </span>

                    <strong>
                        {riskScore != null
                            ? `${riskScore}%`
                            : "—"}
                    </strong>
                </div>

                <span className="analysis-date">
                    {formatDate(createdAt)}
                </span>
            </div>
        </article>
    );
};

export default AnalysisCard;