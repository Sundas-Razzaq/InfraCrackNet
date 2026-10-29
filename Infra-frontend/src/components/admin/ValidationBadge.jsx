// Reuses the existing .analysis-status pending / approved / rejected styles.
const ValidationBadge = ({ value }) => {
    const status = value || "Pending";

    return <span className={`analysis-status ${status.toLowerCase()}`}>{status}</span>;
};

export default ValidationBadge;