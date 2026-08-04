const SeverityBadge = ({ severity = "Low" }) => {
    return (
        <span
            className={`severity-badge severity-${severity.toLowerCase()}`}
        >
            {severity}
        </span>
    );
};

export default SeverityBadge;