const getStatusClass = (status) => {
    switch (status) {
        case "Validated":
            return "validated";

        case "Edited":
            return "edited";

        case "Removed":
            return "removed";

        case "Added":
            return "added";

        default:
            return "pending";
    }
};

const AnnotationSidebar = ({
    summary,
    cracks,
    selectedCrack,
    onSelectCrack,
}) => {
    return (
        <aside className="annotation-sidebar">

            {/* Summary */}

            <div className="annotation-summary-card">

                <h3>Review Summary</h3>

                <div className="summary-grid">

                    <div className="summary-item">
                        <span>Total Images</span>
                        <strong>{summary.totalImages}</strong>
                    </div>

                    <div className="summary-item">
                        <span>Total Cracks</span>
                        <strong>{summary.totalCracks}</strong>
                    </div>

                    <div className="summary-item">
                        <span>Reviewed</span>
                        <strong>{summary.reviewedCracks}</strong>
                    </div>

                    <div className="summary-item">
                        <span>Pending</span>
                        <strong>{summary.pendingReview}</strong>
                    </div>

                </div>

            </div>

            {/* Crack List */}

            <div className="annotation-crack-list">

                <h3>Detected Cracks</h3>

                {cracks.length === 0 ? (

                    <p className="empty-state">
                        No cracks detected.
                    </p>

                ) : (

                    cracks.map((crack) => (

                        <div
                            key={crack._id}
                            className={`annotation-crack-card ${selectedCrack?._id === crack._id
                                ? "active"
                                : ""
                                }`}
                            onClick={() =>
                                onSelectCrack(crack)
                            }
                        >

                            <div className="card-header">

                                <span className="crack-id">
                                    {crack.crackId}
                                </span>

                                <span
                                    className={`status-badge ${getStatusClass(
                                        crack.validationStatus
                                    )}`}
                                >
                                    {crack.validationStatus}
                                </span>

                            </div>

                            <div className="card-body">

                                <p>
                                    <strong>Class:</strong>{" "}
                                    {crack.crackClass}
                                </p>

                                <p>
                                    <strong>Severity:</strong>{" "}
                                    {crack.reviewedSeverity ||
                                        crack.severity}
                                </p>

                                <p>
                                    <strong>Confidence:</strong>{" "}
                                    {crack.confidence}%
                                </p>

                                <p>
                                    <strong>Source:</strong>{" "}
                                    {crack.source}
                                </p>

                                <p>
                                    <strong>Review:</strong>{" "}
                                    {crack.reviewStatus}
                                </p>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </aside>
    );
};

export default AnnotationSidebar;