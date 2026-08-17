const ReportProjectInfo = ({ project }) => {
    return (
        <section className="report-info-section">
            <div className="report-section-heading">
                <h2>Project Information</h2>
            </div>

            <div className="report-info-grid">
                <div className="report-info-item">
                    <span className="detail-label">
                        Project Name
                    </span>

                    <strong>
                        {project?.name || "—"}
                    </strong>
                </div>

                <div className="report-info-item">
                    <span className="detail-label">
                        Project Code
                    </span>

                    <strong>
                        {project?.projectCode || "—"}
                    </strong>
                </div>

                <div className="report-info-item">
                    <span className="detail-label">
                        Structure Type
                    </span>

                    <strong>
                        {project?.structureType || "—"}
                    </strong>
                </div>

                <div className="report-info-item">
                    <span className="detail-label">
                        Location
                    </span>

                    <strong>
                        {project?.location || "—"}
                    </strong>
                </div>

                <div className="report-info-item">
                    <span className="detail-label">
                        Priority
                    </span>

                    <strong>
                        {project?.priority || "—"}
                    </strong>
                </div>
            </div>
        </section>
    );
};

export default ReportProjectInfo;