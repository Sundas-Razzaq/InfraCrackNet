const ReportInspectionInfo = ({ inspection }) => {
    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric",
            }
        );
    };

    return (
        <section className="report-info-section">
            <div className="report-section-heading">
                <h2>Inspection Information</h2>
            </div>

            <div className="report-info-grid">
                <div className="report-info-item">
                    <span className="detail-label">
                        Inspection Code
                    </span>

                    <strong>
                        {inspection?.inspectionCode || "—"}
                    </strong>
                </div>

                <div className="report-info-item">
                    <span className="detail-label">
                        Inspection Type
                    </span>

                    <strong>
                        {inspection?.inspectionType || "—"}
                    </strong>
                </div>

                <div className="report-info-item">
                    <span className="detail-label">
                        Inspection Date
                    </span>

                    <strong>
                        {formatDate(
                            inspection?.inspectionDate
                        )}
                    </strong>
                </div>

                <div className="report-info-item">
                    <span className="detail-label">
                        Structure Area
                    </span>

                    <strong>
                        {inspection?.structureArea || "—"}
                    </strong>
                </div>

                <div className="report-info-item">
                    <span className="detail-label">
                        Weather
                    </span>

                    <strong>
                        {inspection?.weather || "—"}
                    </strong>
                </div>

                <div className="report-info-item">
                    <span className="detail-label">
                        GPS Location
                    </span>

                    <strong>
                        {inspection?.gpsLocation || "—"}
                    </strong>
                </div>

                <div className="report-info-item">
                    <span className="detail-label">
                        Inspection Status
                    </span>

                    <strong>
                        {inspection?.status || "—"}
                    </strong>
                </div>
            </div>
        </section>
    );
};

export default ReportInspectionInfo;