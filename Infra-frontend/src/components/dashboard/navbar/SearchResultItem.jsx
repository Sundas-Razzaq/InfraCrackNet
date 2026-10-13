const SearchResultItem = ({
    item,
    kind,
    active,
    onClick,
}) => {
    // Build the two-line display text per kind
    let primary = "";
    let secondary = "";

    if (kind === "project") {
        primary = item.projectCode || "";
        secondary = item.name || "";
    } else if (kind === "inspection") {
        primary = item.inspectionCode || "";
        secondary = [
            item.structureArea,
            item.project?.name,
        ]
            .filter(Boolean)
            .join(" • ");
    } else if (kind === "analysis") {
        primary = item.analysisCode || "";
        secondary = [
            item.inspection?.inspectionCode,
            item.inspection?.project?.name,
        ]
            .filter(Boolean)
            .join(" • ");
    } else if (kind === "report") {
        primary = item.reportCode || "";
        secondary = [
            item.inspection?.inspectionCode,
            item.inspection?.project?.name,
        ]
            .filter(Boolean)
            .join(" • ");
    }

    return (
        <button
            type="button"
            className={`search-result-item ${active ? "active" : ""
                }`}
            onClick={onClick}
        >
            <div className="search-result-primary">
                {primary}
            </div>
            {secondary && (
                <div className="search-result-secondary">
                    {secondary}
                </div>
            )}
        </button>
    );
};

export default SearchResultItem;