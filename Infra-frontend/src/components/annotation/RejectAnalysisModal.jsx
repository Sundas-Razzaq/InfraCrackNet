import { useState } from "react";

const RejectAnalysisModal = ({
    isOpen,
    isSubmitting = false,
    onClose,
    onConfirm,
}) => {
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedReason = reason.trim();

        if (!trimmedReason) {
            setError(
                "Please provide a reason for rejecting this analysis."
            );
            return;
        }

        if (trimmedReason.length > 1000) {
            setError(
                "Rejection reason cannot exceed 1000 characters."
            );
            return;
        }

        onConfirm(trimmedReason);
    };

    const handleReasonChange = (e) => {
        setReason(e.target.value);

        if (error) {
            setError("");
        }
    };

    return (
        <div
            className="modal-overlay"
            onMouseDown={(e) => {
                if (
                    e.target === e.currentTarget &&
                    !isSubmitting
                ) {
                    onClose();
                }
            }}
        >
            <div
                className="modal-content"
                role="dialog"
                aria-modal="true"
                aria-labelledby="reject-analysis-title"
            >
                <div className="modal-header">
                    <h2 id="reject-analysis-title">
                        Reject AI Analysis
                    </h2>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        disabled={isSubmitting}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                <div className="modal-body">
                    <p>
                        Please provide a reason for rejecting
                        this AI analysis. The reason will be
                        saved with the analysis for future
                        reference.
                    </p>

                    <div className="form-group">
                        <label htmlFor="rejectionReason">
                            Rejection Reason
                        </label>

                        <textarea
                            id="rejectionReason"
                            name="rejectionReason"
                            value={reason}
                            onChange={handleReasonChange}
                            placeholder="Enter the reason for rejecting this analysis..."
                            rows={5}
                            maxLength={1000}
                            disabled={isSubmitting}
                        />

                        <div className="modal-character-count">
                            {reason.length}/1000
                        </div>

                        {error && (
                            <p className="form-error">
                                {error}
                            </p>
                        )}
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Rejecting..."
                            : "Reject Analysis"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectAnalysisModal;