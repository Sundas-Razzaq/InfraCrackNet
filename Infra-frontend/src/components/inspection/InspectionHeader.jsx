const InspectionHeader = ({
    title,
    subtitle,
    children,
}) => {
    return (
        <div className="inspection-header">
            <div className="inspection-header-content">
                <div className="inspection-header-text">
                    <h1 className="inspection-title">
                        {title}
                    </h1>

                    <p className="inspection-subtitle">
                        {subtitle}
                    </p>
                </div>

                {children && (
                    <div className="inspection-header-actions">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InspectionHeader;