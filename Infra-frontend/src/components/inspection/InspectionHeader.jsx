const InspectionHeader = ({
    title = "Start New Inspection",
    subtitle = "Configure inspection details before uploading images.",
}) => {
    return (
        <div className="inspection-header">
            <div className="inspection-header-content">
                <h1 className="inspection-title">
                    {title}
                </h1>

                <p className="inspection-subtitle">
                    {subtitle}
                </p>
            </div>
        </div>
    );
};

export default InspectionHeader;