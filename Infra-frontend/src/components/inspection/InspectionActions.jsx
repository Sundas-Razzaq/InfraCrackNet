const InspectionActions = ({
    onSaveDraft,
    isSubmitting = false,
}) => {
    return (
        <div className="inspection-actions">
            <button
                type="button"
                className="btn-secondary"
                onClick={onSaveDraft}
                disabled={isSubmitting}
            >
                Save as Draft
            </button>

            <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
            >
                {isSubmitting
                    ? "Creating Inspection..."
                    : "Continue to Upload"}
            </button>
        </div>
    );
};

export default InspectionActions;