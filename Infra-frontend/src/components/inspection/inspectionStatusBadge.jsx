const statusClasses = {
    Draft: "status-draft",
    "Images Uploaded": "status-images-uploaded",
    "AI Processing": "status-ai-processing",
    "AI Completed": "status-ai-completed",
    Validated: "status-validated",
    "Report Generated": "status-report-generated",
    Completed: "status-completed",
};

const InspectionStatusBadge = ({ status }) => {
    return (
        <span
            className={`inspection-status-badge ${statusClasses[status] || ""
                }`}
        >
            {status}
        </span>
    );
};

export default InspectionStatusBadge;