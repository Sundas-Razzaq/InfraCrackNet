const ReportCrackTable = ({ cracks = [] }) => {
    const getSeverityClass = (severity) => {
        if (!severity) return "unknown";

        return severity.toLowerCase();
    };

    const getStatusClass = (status) => {
        if (!status) return "unknown";

        return status.toLowerCase();
    };

    return (
        <section className="report-crack-section">
            <div className="report-section-heading">
                <div>
                    <h2>Crack Detection Summary</h2>

                    <p>
                        Final verified crack detections included
                        in this report.
                    </p>
                </div>

                <span className="report-crack-count">
                    {cracks.length}{" "}
                    {cracks.length === 1
                        ? "Crack"
                        : "Cracks"}
                </span>
            </div>

            {cracks.length === 0 ? (
                <div className="report-empty-cracks">
                    No crack detections available.
                </div>
            ) : (
                <div className="report-table-wrapper">
                    <table className="report-crack-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Type</th>
                                <th>Severity</th>
                                <th>Confidence</th>
                                <th>Source</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {cracks.map((crack, index) => (
                                <tr
                                    key={
                                        crack._id ||
                                        crack.crackId ||
                                        index
                                    }
                                >
                                    <td>
                                        {crack.crackId || "—"}
                                    </td>

                                    <td>
                                        {crack.crackClass ||
                                            "—"}
                                    </td>

                                    <td>
                                        <span
                                            className={`report-severity ${getSeverityClass(
                                                crack.severity
                                            )}`}
                                        >
                                            {crack.severity ||
                                                "—"}
                                        </span>
                                    </td>

                                    <td>
                                        {crack.confidence !=
                                            null
                                            ? `${crack.confidence}%`
                                            : "—"}
                                    </td>

                                    <td>
                                        {crack.source || "—"}
                                    </td>

                                    <td>
                                        <span
                                            className={`report-crack-status ${getStatusClass(
                                                crack.validationStatus
                                            )}`}
                                        >
                                            {crack.validationStatus ||
                                                "—"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default ReportCrackTable;