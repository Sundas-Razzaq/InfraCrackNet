const AnnotationToolbar = ({
    onAddManualCrack,
    onRefresh,
    reviewSummary,
}) => {
    return (
        <div className="annotation-toolbar">

            <div className="toolbar-left">

                <h2>Annotation Workspace</h2>

                <span className="toolbar-status">
                    {reviewSummary.reviewedCracks} /{" "}
                    {reviewSummary.totalCracks} Reviewed
                </span>

            </div>

            <div className="toolbar-right">

                <button
                    className="btn btn-secondary"
                    onClick={onRefresh}
                >
                    Refresh
                </button>

                <button
                    className="btn btn-primary"
                    onClick={onAddManualCrack}
                >
                    + Add Manual Crack
                </button>

            </div>

        </div>
    );
};

export default AnnotationToolbar;