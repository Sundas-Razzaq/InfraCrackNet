import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const DeleteConfirmationModal = ({
    isOpen,
    title = "Delete Item",
    description = "Are you sure you want to delete this item?",
    warning = "This action cannot be undone.",
    confirmText = "Delete",
    loading = false,
    onClose,
    onConfirm,
}) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="delete-modal">

                <div className="delete-modal-icon">
                    <FontAwesomeIcon
                        icon={faTriangleExclamation}
                    />
                </div>

                <h2 className="delete-modal-title">
                    {title}
                </h2>

                <p className="delete-modal-description">
                    {description}
                </p>

                <p className="delete-warning">
                    {warning}
                </p>

                <div className="modal-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        className="btn btn-danger"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading
                            ? "Deleting..."
                            : confirmText}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DeleteConfirmationModal;