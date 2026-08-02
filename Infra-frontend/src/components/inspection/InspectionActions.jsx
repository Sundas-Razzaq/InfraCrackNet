const InspectionActions = ({
    onSaveDraft,
    isSubmitting = false,
    submitButtonText = "Continue to Upload",
    draftButtonText = "Save as Draft",
    submittingText = "Creating Inspection...",
}) => {
    return (
        <div className="inspection-actions">
            <button
                type="button"
                className="btn-secondary"
                onClick={onSaveDraft}
                disabled={isSubmitting}
            >
                {draftButtonText}
            </button>

            <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
            >
                {isSubmitting
                    ? submittingText
                    : submitButtonText}
            </button>
        </div>
    );
};

export default InspectionActions;