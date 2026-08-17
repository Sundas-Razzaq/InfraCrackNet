const ReportStatusBadge = ({ status }) => {
    const normalizedStatus = status || "Final";

    return (
        <span
            className={`report-status-badge ${normalizedStatus.toLowerCase()}`}
        >
            {normalizedStatus}
        </span>
    );
};

export default ReportStatusBadge;