import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const DeleteProjectModal = ({
    isOpen,
    onClose,
    onConfirm,
    loading = false,
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
                    Delete Project
                </h2>

                <p className="delete-modal-description">
                    Are you sure you want to delete this project?
                </p>

                <p className="delete-warning">
                    This action cannot be undone.
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
                            : "Delete"}
                    </button>

                </div>

            </div>

        </div>
    );
};

export default DeleteProjectModal;