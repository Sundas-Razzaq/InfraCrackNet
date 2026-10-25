import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const ConfirmModal = ({
    isOpen,
    title = "Are you sure?",
    description = "",
    warning = "",
    confirmText = "Confirm",
    danger = false,
    requireText = "",
    loading = false,
    onClose,
    onConfirm,
}) => {
    const [typed, setTyped] = useState("");

    if (!isOpen) return null;

    const blocked = Boolean(requireText) && typed.trim() !== requireText;

    const handleClose = () => {
        setTyped("");
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="delete-modal">
                <div className="delete-modal-icon">
                    <FontAwesomeIcon icon={faTriangleExclamation} />
                </div>

                <h2 className="delete-modal-title">{title}</h2>
                {description && <p className="delete-modal-description">{description}</p>}
                {warning && <p className="delete-warning">{warning}</p>}

                {requireText && (
                    <div className="form-group">
                        <label className="form-label">
                            Type <strong>{requireText}</strong> to confirm
                        </label>
                        <input
                            className="input"
                            value={typed}
                            onChange={(e) => setTyped(e.target.value)}
                            autoFocus
                        />
                    </div>
                )}

                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={handleClose} disabled={loading}>
                        Cancel
                    </button>
                    <button
                        className={`btn ${danger ? "btn-danger" : "btn-primary"}`}
                        onClick={onConfirm}
                        disabled={loading || blocked}
                    >
                        {loading ? "Please wait..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;