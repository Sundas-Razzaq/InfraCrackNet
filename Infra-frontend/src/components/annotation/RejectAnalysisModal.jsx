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
        <div className="reject-analysis-overlay">
            <div
                className="reject-analysis-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="reject-analysis-title"
            >
                <div className="reject-analysis-header">
                    <div>
                        <h2 id="reject-analysis-title">
                            Reject AI Analysis
                        </h2>

                        <p>
                            Rejecting this analysis requires a reason.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="reject-analysis-close"
                        onClick={onClose}
                        disabled={isSubmitting}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                <div className="reject-analysis-body">
                    <div className="reject-analysis-field">
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

                        <div className="reject-analysis-footer-info">
                            <span>
                                {error || "Please provide a clear reason for rejection."}
                            </span>

                            <span>
                                {reason.length}/1000
                            </span>
                        </div>
                    </div>
                </div>

                <div className="reject-analysis-actions">
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